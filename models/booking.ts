import type { BudgetId, CategoryId, MeetingMode } from '@/data/booking-options'
import type { ConsultationId } from '@/models/consultation'

/**
 * A booking, as stored and as displayed.
 *
 * `pending` is the only status a customer can create; every other transition
 * is an admin action, which is enforced in Security Rules rather than trusted
 * to the client.
 */
export const BOOKING_STATUSES = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'rejected',
] as const

export type BookingStatus = (typeof BOOKING_STATUSES)[number]

/** Statuses that still occupy their slot. Anything else releases it. */
export const ACTIVE_BOOKING_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'completed']

export interface Booking {
  id: string
  /** Human-facing reference, e.g. `TO-A2GTA4`. Unique, shown to the customer. */
  reference: string

  firstName: string
  lastName: string
  company: string
  email: string
  phone: string
  /** ISO 3166-1 alpha-2, or `OTHER`. */
  country: string

  meetingType: MeetingMode
  consultationType: ConsultationId
  /** Minor units, resolved at booking time so a later price change cannot alter history. */
  priceMinor: number
  currency: string
  durationMinutes: number

  /** `YYYY-MM-DD` in the office's local time. */
  date: string
  /** `HH:mm`, 24-hour. */
  time: string

  category: CategoryId | null
  budget: BudgetId | null
  description: string

  status: BookingStatus
  /** Set by an admin on approval; surfaced to the customer. */
  meetingUrl?: string
  /** Internal only — Security Rules keep this readable by admins alone. */
  adminNotes?: string
  /** Locale the booking was made in, so confirmations can match it. */
  locale: string

  createdAt: Date
  updatedAt: Date
}

/** The subset a customer submits. Everything else is derived or admin-owned. */
export type BookingInput = Omit<
  Booking,
  'id' | 'reference' | 'status' | 'createdAt' | 'updatedAt' | 'meetingUrl' | 'adminNotes'
>

export interface BookingFilters {
  status?: BookingStatus | 'all'
  /** Matches reference, name, email or company, case-insensitively. */
  search?: string
  /** Inclusive `YYYY-MM-DD` bounds on the meeting date. */
  from?: string
  to?: string
}

export function customerName(booking: Pick<Booking, 'firstName' | 'lastName'>): string {
  return `${booking.firstName} ${booking.lastName}`.trim()
}

/** Which transitions an admin may perform, by current status. */
export const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'rejected', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: ['pending'],
  rejected: ['pending'],
}
