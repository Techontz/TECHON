import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit as fbLimit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  startAfter,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'

import { getDb, isLive } from '@/services/firebase/client'
import {
  BookingError,
  NotConfiguredError,
  SlotTakenError,
  toBookingError,
} from '@/services/firebase/errors'
import {
  clean,
  createTimestamps,
  num,
  oneOf,
  str,
  toDate,
  updateTimestamp,
} from '@/services/firebase/converters'
import { COLLECTIONS, slotLockId } from '@/models/collections'
import { occupiedSlots } from '@/lib/slots'
import {
  ACTIVE_BOOKING_STATUSES,
  ALLOWED_TRANSITIONS,
  BOOKING_STATUSES,
  type Booking,
  type BookingFilters,
  type BookingInput,
  type BookingStatus,
} from '@/models/booking'
import type { BudgetId, CategoryId, MeetingMode } from '@/data/booking-options'
import type { ConsultationId } from '@/models/consultation'

/**
 * Bookings.
 *
 * The only place in the codebase that writes to `bookings/` or `slotLocks/`.
 * Everything the UI needs — create, list, watch, transition — is expressed
 * here in domain terms, so no component ever imports `firebase/firestore`.
 */

const PAGE_SIZE = 25

/* ------------------------------------------------------------------ Reading */

function mapBooking(snapshot: QueryDocumentSnapshot<DocumentData>): Booking {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    reference: str(data.reference),
    firstName: str(data.firstName),
    lastName: str(data.lastName),
    company: str(data.company),
    email: str(data.email),
    phone: str(data.phone),
    country: str(data.country),
    meetingType: oneOf<MeetingMode>(data.meetingType, ['office', 'online'], 'online'),
    consultationType: str(data.consultationType) as ConsultationId,
    priceMinor: num(data.priceMinor),
    currency: str(data.currency, 'TZS'),
    durationMinutes: num(data.durationMinutes, 30),
    date: str(data.date),
    time: str(data.time),
    category: (data.category as CategoryId) ?? null,
    budget: (data.budget as BudgetId) ?? null,
    description: str(data.description),
    status: oneOf<BookingStatus>(data.status, BOOKING_STATUSES, 'pending'),
    meetingUrl: data.meetingUrl ? str(data.meetingUrl) : undefined,
    adminNotes: data.adminNotes ? str(data.adminNotes) : undefined,
    locale: str(data.locale, 'en'),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  }
}

export interface BookingPage {
  bookings: Booking[]
  /** Opaque cursor for the next page; undefined when the list is exhausted. */
  cursor?: QueryDocumentSnapshot<DocumentData>
  hasMore: boolean
}

/**
 * One page of bookings, newest meeting first.
 *
 * Status and date range are applied in Firestore (indexed); free-text search
 * is applied in memory, because Firestore has no substring operator and a
 * search service is not worth introducing at this volume.
 */
export async function listBookings(
  filters: BookingFilters = {},
  cursor?: QueryDocumentSnapshot<DocumentData>,
): Promise<BookingPage> {
  if (!isLive()) return { bookings: [], hasMore: false }

  const constraints = []

  if (filters.status && filters.status !== 'all') {
    constraints.push(where('status', '==', filters.status))
  }
  if (filters.from) constraints.push(where('date', '>=', filters.from))
  if (filters.to) constraints.push(where('date', '<=', filters.to))

  constraints.push(orderBy('date', 'desc'), orderBy('time', 'desc'))
  if (cursor) constraints.push(startAfter(cursor))
  // One extra row is fetched purely to answer "is there another page?".
  constraints.push(fbLimit(PAGE_SIZE + 1))

  const snapshot = await getDocs(query(collection(getDb(), COLLECTIONS.bookings), ...constraints))

  const docs = snapshot.docs.slice(0, PAGE_SIZE)
  const hasMore = snapshot.docs.length > PAGE_SIZE

  let bookings = docs.map(mapBooking)

  if (filters.search) {
    const needle = filters.search.trim().toLowerCase()
    bookings = bookings.filter((booking) =>
      [booking.reference, booking.firstName, booking.lastName, booking.email, booking.company]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    )
  }

  return { bookings, cursor: docs.at(-1), hasMore }
}

/**
 * Live bookings for a date range.
 *
 * Used by the admin calendar, where a booking arriving while the page is open
 * should appear without a refresh.
 */
export function watchBookings(
  from: string,
  to: string,
  onChange: (bookings: Booking[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  if (!isLive()) {
    onChange([])
    return () => {}
  }

  return onSnapshot(
    query(
      collection(getDb(), COLLECTIONS.bookings),
      where('date', '>=', from),
      where('date', '<=', to),
      orderBy('date', 'asc'),
      orderBy('time', 'asc'),
    ),
    (snapshot) => onChange(snapshot.docs.map(mapBooking)),
    (error) => onError?.(error),
  )
}

export async function getBooking(id: string): Promise<Booking | null> {
  if (!isLive()) return null

  const snapshot = await getDoc(doc(getDb(), COLLECTIONS.bookings, id))
  if (!snapshot.exists()) return null

  return mapBooking(snapshot as QueryDocumentSnapshot<DocumentData>)
}

/* ------------------------------------------------------------------ Writing */

/** Unambiguous reference — no 0/O or 1/I. */
function createReference(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let index = 0; index < 6; index += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `TO-${suffix}`
}

export interface CreatedBooking {
  id: string
  reference: string
}

/**
 * Creates a booking, or fails because the slot has gone.
 *
 * This is the double-booking guard, and it rests on two facts:
 *
 *   1. The lock document's id is derived from the date and time, so two people
 *      choosing the same slot target the identical path.
 *   2. The write happens inside `runTransaction`, which re-runs if anything it
 *      read changed. The transaction reads the lock and refuses to proceed if
 *      it exists, and Security Rules additionally reject any `update` to a
 *      lock — so even a hostile client cannot overwrite one.
 *
 * Both documents are written in the same transaction: a booking without a lock
 * (or a lock without a booking) is never observable.
 */
export async function createBooking(
  input: BookingInput,
  /**
   * Grid size in minutes. Supplied by the caller — which has already read the
   * availability settings — rather than fetched here, so this module stays
   * free of a circular dependency on the availability repository.
   */
  slotMinutes = 60,
): Promise<CreatedBooking> {
  if (!isLive()) throw new NotConfiguredError('Booking')

  const db = getDb()
  const reference = createReference()
  const bookingRef = doc(collection(db, COLLECTIONS.bookings))

  // An appointment longer than one grid slot occupies — and must lock — every
  // slot it covers. A 120-minute booking at 10:00 claims 10:00 and 11:00, so
  // nobody can take 11:00 out from under it.
  const spans = occupiedSlots(input.time, input.durationMinutes, slotMinutes)
  const lockRefs = spans.map((slot) =>
    doc(db, COLLECTIONS.slotLocks, slotLockId(input.date, slot)),
  )

  try {
    await runTransaction(db, async (transaction) => {
      // All reads first — a transaction may not read after writing.
      const existing = await Promise.all(lockRefs.map((ref) => transaction.get(ref)))
      if (existing.some((snapshot) => snapshot.exists())) throw new SlotTakenError()

      lockRefs.forEach((ref, index) => {
        transaction.set(ref, {
          date: input.date,
          time: spans[index],
          bookingId: bookingRef.id,
          reference,
          ...createTimestamps(),
        })
      })

      transaction.set(
        bookingRef,
        clean({
          ...input,
          reference,
          // Customers can only ever create a pending booking; confirmation is
          // an admin action, enforced in Security Rules too.
          status: 'pending' satisfies BookingStatus,
          ...createTimestamps(),
        }),
      )
    })
  } catch (error) {
    throw toBookingError(error)
  }

  return { id: bookingRef.id, reference }
}

/**
 * Moves a booking to a new status.
 *
 * Cancelling or rejecting releases the slot lock in the same transaction, so
 * the time becomes bookable again immediately rather than after a cleanup job.
 */
export async function setBookingStatus(
  id: string,
  next: BookingStatus,
  extra: { meetingUrl?: string; adminNotes?: string } = {},
  slotMinutes = 60,
): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Booking management')

  const db = getDb()
  const bookingRef = doc(db, COLLECTIONS.bookings, id)

  try {
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(bookingRef)
      if (!snapshot.exists()) throw new BookingError('invalid-request', 'Booking not found.')

      const current = snapshot.data()
      const currentStatus = oneOf<BookingStatus>(current.status, BOOKING_STATUSES, 'pending')

      if (!ALLOWED_TRANSITIONS[currentStatus].includes(next)) {
        throw new BookingError(
          'invalid-request',
          `Cannot move a ${currentStatus} booking to ${next}.`,
        )
      }

      // A long appointment holds several locks; all of them move together.
      const spans = occupiedSlots(
        str(current.time),
        num(current.durationMinutes, slotMinutes),
        slotMinutes,
      )
      const lockRefs = spans.map((slot) =>
        doc(db, COLLECTIONS.slotLocks, slotLockId(str(current.date), slot)),
      )

      const releasesSlot = !ACTIVE_BOOKING_STATUSES.includes(next)
      const reclaimsSlot =
        ACTIVE_BOOKING_STATUSES.includes(next) && !ACTIVE_BOOKING_STATUSES.includes(currentStatus)

      // Reading before any write — a transaction may not read after writing.
      if (reclaimsSlot) {
        const existing = await Promise.all(lockRefs.map((ref) => transaction.get(ref)))
        // Reinstating a cancelled booking can fail: the slot may have been
        // taken by someone else in the meantime, and they have the better claim.
        if (existing.some((snapshot) => snapshot.exists())) throw new SlotTakenError()
      }

      transaction.update(bookingRef, clean({ status: next, ...extra, ...updateTimestamp() }))

      if (releasesSlot) lockRefs.forEach((ref) => transaction.delete(ref))
      if (reclaimsSlot) {
        lockRefs.forEach((ref, index) => {
          transaction.set(ref, {
            date: str(current.date),
            time: spans[index],
            bookingId: id,
            reference: str(current.reference),
            ...createTimestamps(),
          })
        })
      }
    })
  } catch (error) {
    throw toBookingError(error)
  }
}

/**
 * Moves a booking to a different slot.
 *
 * Acquires the new lock and releases the old one atomically, so a failed
 * reschedule never leaves the booking holding two slots or none.
 */
export async function rescheduleBooking(
  id: string,
  date: string,
  time: string,
  slotMinutes = 60,
): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Rescheduling')

  const db = getDb()
  const bookingRef = doc(db, COLLECTIONS.bookings, id)

  try {
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(bookingRef)
      if (!snapshot.exists()) throw new BookingError('invalid-request', 'Booking not found.')

      const current = snapshot.data()
      if (str(current.date) === date && str(current.time) === time) return

      const duration = num(current.durationMinutes, slotMinutes)
      const nextSpans = occupiedSlots(time, duration, slotMinutes)
      const previousSpans = occupiedSlots(str(current.time), duration, slotMinutes)

      const nextRefs = nextSpans.map((slot) =>
        doc(db, COLLECTIONS.slotLocks, slotLockId(date, slot)),
      )
      const previousRefs = previousSpans.map((slot) =>
        doc(db, COLLECTIONS.slotLocks, slotLockId(str(current.date), slot)),
      )

      // The booking's own locks are not an obstacle to moving it.
      const ownPaths = new Set(previousRefs.map((ref) => ref.path))
      const existing = await Promise.all(nextRefs.map((ref) => transaction.get(ref)))
      const clash = existing.some(
        (snapshot) => snapshot.exists() && !ownPaths.has(snapshot.ref.path),
      )
      if (clash) throw new SlotTakenError()

      previousRefs.forEach((ref) => transaction.delete(ref))
      nextRefs.forEach((ref, index) => {
        transaction.set(ref, {
          date,
          time: nextSpans[index],
          bookingId: id,
          reference: str(current.reference),
          ...createTimestamps(),
        })
      })
      transaction.update(bookingRef, { date, time, ...updateTimestamp() })
    })
  } catch (error) {
    throw toBookingError(error)
  }
}

export async function updateBookingNotes(id: string, adminNotes: string): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Booking management')
  await updateDoc(doc(getDb(), COLLECTIONS.bookings, id), { adminNotes, ...updateTimestamp() })
}

/** Removes a booking and frees its slot. Admin-only; prefer cancelling. */
export async function deleteBooking(id: string, slotMinutes = 60): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Booking management')

  const db = getDb()
  const snapshot = await getDoc(doc(db, COLLECTIONS.bookings, id))
  if (!snapshot.exists()) return

  const data = snapshot.data()
  const spans = occupiedSlots(
    str(data.time),
    num(data.durationMinutes, slotMinutes),
    slotMinutes,
  )

  await Promise.all(
    spans.map((slot) =>
      deleteDoc(doc(db, COLLECTIONS.slotLocks, slotLockId(str(data.date), slot))),
    ),
  )
  await deleteDoc(doc(db, COLLECTIONS.bookings, id))
}

/* ---------------------------------------------------------------- Slot locks */

/**
 * Taken slots in a date range.
 *
 * Read from `slotLocks` rather than `bookings` on purpose: the lock collection
 * is publicly readable and contains no personal data, so the booking calendar
 * can show what is taken without exposing who took it.
 */
export async function getTakenSlots(from: string, to: string): Promise<Record<string, string[]>> {
  if (!isLive()) return {}

  const snapshot = await getDocs(
    query(
      collection(getDb(), COLLECTIONS.slotLocks),
      where('date', '>=', from),
      where('date', '<=', to),
    ),
  )

  const taken: Record<string, string[]> = {}
  for (const document of snapshot.docs) {
    const data = document.data()
    const date = str(data.date)
    const time = str(data.time)
    if (!date || !time) continue
    ;(taken[date] ??= []).push(time)
  }

  return taken
}

/** Live version of `getTakenSlots`, so a slot grays out as someone else books it. */
export function watchTakenSlots(
  from: string,
  to: string,
  onChange: (taken: Record<string, string[]>) => void,
): Unsubscribe {
  if (!isLive()) {
    onChange({})
    return () => {}
  }

  return onSnapshot(
    query(
      collection(getDb(), COLLECTIONS.slotLocks),
      where('date', '>=', from),
      where('date', '<=', to),
    ),
    (snapshot) => {
      const taken: Record<string, string[]> = {}
      for (const document of snapshot.docs) {
        const data = document.data()
        const date = str(data.date)
        const time = str(data.time)
        if (!date || !time) continue
        ;(taken[date] ??= []).push(time)
      }
      onChange(taken)
    },
  )
}

/** Counts by status, for the dashboard. Cheap enough at this volume. */
export async function getBookingCounts(): Promise<Record<BookingStatus, number>> {
  const empty = Object.fromEntries(BOOKING_STATUSES.map((s) => [s, 0])) as Record<
    BookingStatus,
    number
  >
  if (!isLive()) return empty

  const snapshot = await getDocs(collection(getDb(), COLLECTIONS.bookings))
  for (const document of snapshot.docs) {
    const status = oneOf<BookingStatus>(document.data().status, BOOKING_STATUSES, 'pending')
    empty[status] += 1
  }
  return empty
}

