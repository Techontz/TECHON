/**
 * Availability.
 *
 * A day is never "booked". Individual *slots* are booked, and a day is only
 * unavailable once every slot on it has gone — which is what
 * `SlotAvailability.availableCount === 0` expresses. Nothing in this model can
 * mark a whole day taken; only `closed` (not a working day) and admin
 * overrides can remove a day, and those are schedule facts, not bookings.
 *
 * Three sources combine:
 *   1. `WeeklySchedule` — which start times exist on each weekday.
 *   2. `DayOverride`    — admin exceptions for one date.
 *   3. Slot locks       — what has actually been reserved.
 */

/** `HH:mm`, 24-hour. */
export type TimeString = string

/** One weekday's bookable start times. An empty list means closed. */
export interface DaySchedule {
  slots: TimeString[]
  /**
   * Renders a break divider after this slot. Purely presentational — the slot
   * itself stays bookable, and no time is removed from the day.
   */
  breakAfter?: TimeString
}

/** Sunday = 0, matching `Date.getDay()`. */
export type WeeklySchedule = Record<number, DaySchedule>

export const DEFAULT_SCHEDULE: WeeklySchedule = {
  0: { slots: [] }, // Sunday — closed
  1: weekday(),
  2: weekday(),
  3: weekday(),
  4: weekday(),
  5: weekday(),
  6: { slots: ['09:00', '10:00', '11:00', '12:00'] }, // Saturday — mornings only
}

function weekday(): DaySchedule {
  return {
    slots: [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      // Lunch sits here. Both 12:00 and 13:00 remain bookable; the divider is
      // shown between them.
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ],
    breakAfter: '12:00',
  }
}

/** Appointment lengths the engine supports. */
export const SUPPORTED_DURATIONS = [15, 30, 45, 60, 90, 120] as const
export type DurationMinutes = (typeof SUPPORTED_DURATIONS)[number]

export interface AvailabilitySettings {
  schedule: WeeklySchedule
  /**
   * Grid granularity in minutes. Start times are the schedule's own list; this
   * is how much time each one consumes when an appointment is longer than one
   * slot, so a 120-minute booking occupies two 60-minute slots.
   */
  slotMinutes: number
  /** Days of notice required — 1 means tomorrow is the earliest booking. */
  minimumNoticeDays: number
  bookingWindowDays: number
  timezone: string
}

export const DEFAULT_AVAILABILITY: AvailabilitySettings = {
  schedule: DEFAULT_SCHEDULE,
  slotMinutes: 60,
  minimumNoticeDays: 1,
  bookingWindowDays: 60,
  timezone: 'Africa/Dar_es_Salaam',
}

/** A per-day exception. Document id is the `YYYY-MM-DD` it applies to. */
export interface DayOverride {
  date: string
  /** Closes the day entirely — a holiday, not a booking. */
  closed: boolean
  /** Opens a day the weekly schedule closes, e.g. a Sunday. */
  forceOpen: boolean
  /** Individual start times made unavailable by an admin. */
  blockedSlots: TimeString[]
  /** Replaces the weekday's slots for this date only. Empty uses the default. */
  customHours: TimeString[]
  note: string
}

export function emptyOverride(date: string): DayOverride {
  return { date, closed: false, forceOpen: false, blockedSlots: [], customHours: [], note: '' }
}

/** Why a slot cannot be taken. `null` when it can. */
export type SlotUnavailableReason = 'booked' | 'blocked' | 'past' | 'tooLate'

/**
 * One row of the response the UI renders directly.
 *
 * This is the shape `getAvailableSlots` returns — a complete picture of the
 * day, including the slots that are gone, so the interface can show them
 * greyed rather than silently omitting them.
 */
export interface SlotView {
  time: TimeString
  available: boolean
  reason: SlotUnavailableReason | null
  /** Render a break divider after this row. */
  breakAfter?: boolean
}

/** How busy a day is, for the calendar dot. */
export type DayLoad = 'open' | 'filling' | 'full'

/** Below this share of slots remaining, a day reads as "filling up". */
export const FILLING_THRESHOLD = 0.5

export type DayStatus = 'available' | 'fullyBooked' | 'closed' | 'past' | 'outOfWindow'

export interface SlotAvailability {
  date: string
  status: DayStatus
  load: DayLoad
  slots: SlotView[]
  totalCount: number
  availableCount: number
  note?: string
}

export type AvailabilityMap = Record<string, SlotAvailability>
