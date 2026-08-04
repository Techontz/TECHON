import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'

import { getDb, isLive } from '@/services/firebase/client'
import { NotConfiguredError } from '@/services/firebase/errors'
import { bool, num, str, strArray, updateTimestamp } from '@/services/firebase/converters'
import { COLLECTIONS } from '@/models/collections'
import {
  DEFAULT_AVAILABILITY,
  emptyOverride,
  type AvailabilityMap,
  type AvailabilitySettings,
  type DayOverride,
  type DaySchedule,
  type SlotAvailability,
  type SlotView,
  type WeeklySchedule,
} from '@/models/availability'
import { computeDayAvailability, freeTimes, toDateKey } from '@/lib/slots'
import { getTakenSlots } from '@/repositories/bookings'

/**
 * Availability, backed by Firestore.
 *
 * This module fetches; `lib/slots.ts` decides. Keeping the two apart is what
 * lets the admin panel resolve availability for a hypothetical schedule
 * without writing anything, and lets the engine be tested without a database.
 *
 * With Firebase unconfigured every read degrades to "nothing is booked" rather
 * than to fabricated closures — an empty diary, which is the honest default.
 */

export { toDateKey, fromDateKey, startOfToday, addDays } from '@/lib/slots'

/* ------------------------------------------------------------------ Settings */

const SETTINGS_DOC = 'availability'

function mapSchedule(raw: unknown): WeeklySchedule {
  if (!raw || typeof raw !== 'object') return DEFAULT_AVAILABILITY.schedule

  const schedule: WeeklySchedule = {}
  for (let day = 0; day <= 6; day += 1) {
    const entry = (raw as Record<string, unknown>)[String(day)] as Partial<DaySchedule> | undefined
    schedule[day] = {
      slots: strArray(entry?.slots).sort(),
      breakAfter: entry?.breakAfter ? str(entry.breakAfter) : undefined,
    }
  }
  return schedule
}

export async function getAvailabilitySettings(): Promise<AvailabilitySettings> {
  if (!isLive()) return DEFAULT_AVAILABILITY

  try {
    const snapshot = await getDoc(doc(getDb(), COLLECTIONS.content, SETTINGS_DOC))
    if (!snapshot.exists()) return DEFAULT_AVAILABILITY

    const data = snapshot.data()
    const schedule = mapSchedule(data.schedule)

    // A schedule with no open day at all is a mistake, not a policy — fall
    // back rather than presenting a calendar nobody can book.
    const hasAnyOpenDay = Object.values(schedule).some((day) => day.slots.length > 0)

    return {
      schedule: hasAnyOpenDay ? schedule : DEFAULT_AVAILABILITY.schedule,
      slotMinutes: num(data.slotMinutes, DEFAULT_AVAILABILITY.slotMinutes),
      minimumNoticeDays: num(data.minimumNoticeDays, DEFAULT_AVAILABILITY.minimumNoticeDays),
      bookingWindowDays: num(data.bookingWindowDays, DEFAULT_AVAILABILITY.bookingWindowDays),
      timezone: str(data.timezone, DEFAULT_AVAILABILITY.timezone),
    }
  } catch {
    return DEFAULT_AVAILABILITY
  }
}

export async function saveAvailabilitySettings(settings: AvailabilitySettings): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Availability settings')

  await setDoc(
    doc(getDb(), COLLECTIONS.content, SETTINGS_DOC),
    { ...settings, ...updateTimestamp() },
    { merge: true },
  )
}

/* ----------------------------------------------------------------- Overrides */

function mapOverride(id: string, data: Record<string, unknown>): DayOverride {
  return {
    date: id,
    closed: bool(data.closed),
    forceOpen: bool(data.forceOpen),
    blockedSlots: strArray(data.blockedSlots),
    customHours: strArray(data.customHours),
    note: str(data.note),
  }
}

export async function getOverrides(from: string, to: string): Promise<Record<string, DayOverride>> {
  if (!isLive()) return {}

  try {
    const snapshot = await getDocs(
      query(
        collection(getDb(), COLLECTIONS.availability),
        where('date', '>=', from),
        where('date', '<=', to),
      ),
    )

    const overrides: Record<string, DayOverride> = {}
    for (const document of snapshot.docs) {
      overrides[document.id] = mapOverride(document.id, document.data())
    }
    return overrides
  } catch {
    return {}
  }
}

export async function getOverride(date: string): Promise<DayOverride> {
  if (!isLive()) return emptyOverride(date)

  const snapshot = await getDoc(doc(getDb(), COLLECTIONS.availability, date))
  return snapshot.exists() ? mapOverride(date, snapshot.data()) : emptyOverride(date)
}

export async function saveOverride(override: DayOverride): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Availability')

  const isNoop =
    !override.closed &&
    !override.forceOpen &&
    override.blockedSlots.length === 0 &&
    override.customHours.length === 0 &&
    !override.note.trim()

  // An override that changes nothing is removed, so the collection only ever
  // holds real exceptions and the admin list stays meaningful.
  if (isNoop) {
    await deleteDoc(doc(getDb(), COLLECTIONS.availability, override.date))
    return
  }

  await setDoc(doc(getDb(), COLLECTIONS.availability, override.date), {
    ...override,
    ...updateTimestamp(),
  })
}

/** Blocks a single slot without touching the rest of the day. */
export async function blockSlot(date: string, time: string): Promise<void> {
  const override = await getOverride(date)
  if (override.blockedSlots.includes(time)) return
  await saveOverride({ ...override, blockedSlots: [...override.blockedSlots, time].sort() })
}

/** Releases a slot an admin had blocked. Does not affect real bookings. */
export async function unblockSlot(date: string, time: string): Promise<void> {
  const override = await getOverride(date)
  await saveOverride({
    ...override,
    blockedSlots: override.blockedSlots.filter((slot) => slot !== time),
  })
}

/** Replaces the working hours for one date — the extend/reduce action. */
export async function setCustomHours(date: string, hours: string[]): Promise<void> {
  const override = await getOverride(date)
  await saveOverride({ ...override, customHours: [...hours].sort() })
}

export async function setDayClosed(date: string, closed: boolean): Promise<void> {
  const override = await getOverride(date)
  await saveOverride({ ...override, closed, forceOpen: closed ? false : override.forceOpen })
}

export async function setDayForceOpen(date: string, forceOpen: boolean): Promise<void> {
  const override = await getOverride(date)
  await saveOverride({ ...override, forceOpen, closed: forceOpen ? false : override.closed })
}

export async function clearOverride(date: string): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Availability')
  await deleteDoc(doc(getDb(), COLLECTIONS.availability, date))
}

/* -------------------------------------------------------------- Availability */

/**
 * Every slot on a date, each flagged available or not.
 *
 * This is the primary API the brief asked for. It returns the *whole* day —
 * including the slots that are gone and why — so the interface can grey them
 * out instead of quietly dropping them.
 */
export async function getAvailableSlots(
  date: string,
  durationMinutes?: number,
): Promise<SlotAvailability> {
  const [settings, override, taken] = await Promise.all([
    getAvailabilitySettings(),
    getOverride(date),
    getTakenSlots(date, date),
  ])

  return computeDayAvailability({
    date,
    settings,
    override,
    takenSlots: taken[date] ?? [],
    durationMinutes,
  })
}

/** The narrow form: just the bookable start times. */
export async function getFreeTimes(date: string, durationMinutes?: number): Promise<string[]> {
  return freeTimes(await getAvailableSlots(date, durationMinutes))
}

/**
 * A whole month, for the calendar.
 *
 * Three reads regardless of month length — settings, that month's overrides,
 * that month's slot locks — then pure computation per day.
 */
export async function getMonthAvailability(
  year: number,
  month: number,
  durationMinutes?: number,
): Promise<AvailabilityMap> {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const from = toDateKey(first)
  const to = toDateKey(last)

  const [settings, overrides, taken] = await Promise.all([
    getAvailabilitySettings(),
    getOverrides(from, to),
    getTakenSlots(from, to),
  ])

  const map: AvailabilityMap = {}
  const cursor = new Date(first)

  while (cursor.getMonth() === month) {
    const key = toDateKey(cursor)
    map[key] = computeDayAvailability({
      date: key,
      settings,
      override: overrides[key],
      takenSlots: taken[key] ?? [],
      durationMinutes,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return map
}

export type { SlotAvailability, SlotView }
