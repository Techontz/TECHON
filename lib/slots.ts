import {
  DEFAULT_AVAILABILITY,
  FILLING_THRESHOLD,
  type AvailabilitySettings,
  type DayLoad,
  type DayOverride,
  type DayStatus,
  type SlotAvailability,
  type SlotView,
  type TimeString,
} from '@/models/availability'

/**
 * The slot engine.
 *
 * Pure functions over plain data — no Firestore, no React. The public booking
 * page and the admin panel both compute availability through here, so the two
 * can never disagree about whether 11:00 is free.
 *
 * The central rule: a day is unavailable only when every one of its slots is
 * unavailable. There is deliberately no way to express "this whole day is
 * booked" — that state can only ever be *derived*.
 */

/* ------------------------------------------------------------------- Time */

export function timeToMinutes(time: TimeString): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function minutesToTime(total: number): TimeString {
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/**
 * Every grid slot an appointment occupies.
 *
 * This is what makes variable durations work without redesigning anything: a
 * 120-minute booking starting at 10:00 on a 60-minute grid returns
 * `['10:00', '11:00']`, and both must be free for the booking to be possible —
 * and both are locked when it is made.
 */
export function occupiedSlots(
  start: TimeString,
  durationMinutes: number,
  slotMinutes: number,
): TimeString[] {
  const startMinutes = timeToMinutes(start)
  const count = Math.max(1, Math.ceil(durationMinutes / slotMinutes))

  return Array.from({ length: count }, (_, index) =>
    minutesToTime(startMinutes + index * slotMinutes),
  )
}

/* --------------------------------------------------------------- Schedule */

/** The start times defined for a date, before bookings or blocks are applied. */
export function scheduledSlots(
  date: Date,
  settings: AvailabilitySettings,
  override?: DayOverride,
): { slots: TimeString[]; breakAfter?: TimeString } {
  if (override?.customHours.length) {
    return { slots: [...override.customHours].sort() }
  }

  const day = settings.schedule[date.getDay()]
  if (!day) return { slots: [] }

  // `forceOpen` on a closed weekday needs somewhere to draw its hours from;
  // Monday's schedule is the sensible default for an exceptional opening.
  if (day.slots.length === 0 && override?.forceOpen) {
    const fallback = settings.schedule[1]
    return { slots: fallback?.slots ?? [], breakAfter: fallback?.breakAfter }
  }

  return { slots: day.slots, breakAfter: day.breakAfter }
}

/* ------------------------------------------------------------ Computation */

export interface ComputeInput {
  /** `YYYY-MM-DD`. */
  date: string
  settings?: AvailabilitySettings
  override?: DayOverride
  /** Start times already reserved on this date. */
  takenSlots?: TimeString[]
  /** Length of the appointment being booked. Drives the overlap check. */
  durationMinutes?: number
  /** Midnight today. Injected so the function stays pure and testable. */
  today?: Date
  /** Current wall-clock time, for same-day cutoffs. */
  now?: Date
}

/**
 * Availability for one date.
 *
 * Returns every slot the day defines, each flagged available or not with the
 * reason — the shape the UI renders straight from, so a taken slot appears
 * greyed rather than vanishing.
 */
export function computeDayAvailability(input: ComputeInput): SlotAvailability {
  const settings = input.settings ?? DEFAULT_AVAILABILITY
  const duration = input.durationMinutes ?? settings.slotMinutes
  const taken = new Set(input.takenSlots ?? [])
  const blocked = new Set(input.override?.blockedSlots ?? [])

  const date = fromDateKey(input.date)
  const today = input.today ?? startOfToday()
  const offset = Math.round((date.getTime() - today.getTime()) / 86_400_000)

  const empty = (status: DayStatus): SlotAvailability => ({
    date: input.date,
    status,
    load: 'full',
    slots: [],
    totalCount: 0,
    availableCount: 0,
    note: input.override?.note,
  })

  if (offset < settings.minimumNoticeDays) return empty('past')
  if (offset > settings.bookingWindowDays) return empty('outOfWindow')
  if (input.override?.closed) return empty('closed')

  const { slots: startTimes, breakAfter } = scheduledSlots(date, settings, input.override)
  if (startTimes.length === 0) return empty('closed')

  const defined = new Set(startTimes)

  const slots: SlotView[] = startTimes.map((time) => {
    // An appointment must fit entirely inside the working day, and every grid
    // slot it covers must be free — that is what a 90-minute booking at 17:00
    // failing correctly depends on.
    const span = occupiedSlots(time, duration, settings.slotMinutes)
    const fits = span.every((slot) => defined.has(slot))

    let reason: SlotView['reason'] = null
    if (span.some((slot) => taken.has(slot))) reason = 'booked'
    else if (span.some((slot) => blocked.has(slot))) reason = 'blocked'
    else if (!fits) reason = 'tooLate'

    return {
      time,
      available: reason === null,
      reason,
      breakAfter: breakAfter === time || undefined,
    }
  })

  const availableCount = slots.filter((slot) => slot.available).length

  return {
    date: input.date,
    // The only route to `fullyBooked` is every slot being unavailable.
    status: availableCount === 0 ? 'fullyBooked' : 'available',
    load: loadFor(availableCount, slots.length),
    slots,
    totalCount: slots.length,
    availableCount,
    note: input.override?.note,
  }
}

/** Drives the calendar dot: green, orange, red. */
export function loadFor(availableCount: number, totalCount: number): DayLoad {
  if (availableCount === 0) return 'full'
  if (totalCount === 0) return 'full'
  return availableCount / totalCount >= FILLING_THRESHOLD ? 'open' : 'filling'
}

/**
 * The response shape the brief asked for.
 *
 * `getAvailableSlots` in its narrow form — just the free times — is available
 * as `freeTimes()` below, but the UI wants the full picture including what has
 * gone, so this is the primary API.
 */
export function toSlotViews(availability: SlotAvailability): SlotView[] {
  return availability.slots
}

/** Only the bookable start times, e.g. `['08:00', '09:00', '11:00']`. */
export function freeTimes(availability: SlotAvailability): TimeString[] {
  return availability.slots.filter((slot) => slot.available).map((slot) => slot.time)
}

/* ---------------------------------------------------------- Date utilities */

/** `YYYY-MM-DD` in local time. `toISOString()` would shift across midnight. */
export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function startOfToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}
