import { fromDateKey } from '@/lib/slots'
import type { BudgetId, CategoryId, MeetingMode } from '@/data/booking-options'
import type { ConsultationId } from '@/data/consultations'

/**
 * The booking domain: the shape of a request, how it is validated, and how a
 * confirmed booking turns into a calendar event.
 *
 * Deliberately free of React and of copy — everything here is what a backend
 * would also need to agree on, so the contract is already written when one
 * arrives.
 */

export interface BookingDraft {
  consultationId: ConsultationId | null
  /** `YYYY-MM-DD`. */
  date: string | null
  /** `HH:mm`. Any start time the schedule defines. */
  time: string | null
  meeting: MeetingMode | null

  firstName: string
  lastName: string
  company: string
  email: string
  phone: string
  country: string

  category: CategoryId | null
  budget: BudgetId | null
  description: string
}

export const emptyDraft: BookingDraft = {
  consultationId: null,
  date: null,
  time: null,
  meeting: null,
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  phone: '',
  country: '',
  category: null,
  budget: null,
  description: '',
}

/** A draft that has been accepted, plus what the server assigned it. */
export interface ConfirmedBooking {
  reference: string
  draft: BookingDraft
  /** Issued by the conferencing provider. Placeholder until one is wired in. */
  meetingUrl?: string
}

/* --------------------------------------------------------------- Validation */

/** Deliberately permissive — a server is the only place worth being strict. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Digits, spaces and the usual separators; at least seven digits. */
const PHONE = /^[+()\d\s-]{7,}$/

export type FieldName = 'firstName' | 'lastName' | 'email' | 'phone' | 'country' | 'category' | 'budget'

/** Field-level errors keyed by name, so inputs can mark themselves invalid. */
export type FieldErrors = Partial<Record<FieldName, 'required' | 'invalid'>>

export function validateDetails(draft: BookingDraft): FieldErrors {
  const errors: FieldErrors = {}

  if (!draft.firstName.trim()) errors.firstName = 'required'
  if (!draft.lastName.trim()) errors.lastName = 'required'

  if (!draft.email.trim()) errors.email = 'required'
  else if (!EMAIL.test(draft.email.trim())) errors.email = 'invalid'

  if (!draft.phone.trim()) errors.phone = 'required'
  else if (!PHONE.test(draft.phone.trim())) errors.phone = 'invalid'

  if (!draft.country) errors.country = 'required'
  if (!draft.category) errors.category = 'required'
  if (!draft.budget) errors.budget = 'required'

  return errors
}

export function isScheduleComplete(draft: BookingDraft): boolean {
  return Boolean(draft.date && draft.time && draft.meeting)
}

export function isDetailsComplete(draft: BookingDraft): boolean {
  return Object.keys(validateDetails(draft)).length === 0
}

/* ------------------------------------------------------------------- Timing */

/** Local `Date` for the selected slot. Returns null until both are chosen. */
export function toStartDate(draft: BookingDraft): Date | null {
  if (!draft.date || !draft.time) return null

  const [hours, minutes] = draft.time.split(':').map(Number)
  const date = fromDateKey(draft.date)
  date.setHours(hours, minutes, 0, 0)
  return date
}

export function toEndDate(start: Date, durationMinutes: number): Date {
  return new Date(start.getTime() + durationMinutes * 60_000)
}

/** `20260812T090000Z` — the compact UTC form calendar providers expect. */
function toCalendarStamp(date: Date): string {
  return date.toISOString().replace(/[-:]|\.\d{3}/g, '')
}

/* ------------------------------------------------------------ Calendar links */

export interface CalendarEvent {
  title: string
  description: string
  location: string
  start: Date
  end: Date
}

export function googleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toCalendarStamp(event.start)}/${toCalendarStamp(event.end)}`,
    details: event.description,
    location: event.location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function outlookCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: event.start.toISOString(),
    enddt: event.end.toISOString(),
    body: event.description,
    location: event.location,
  })
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

/**
 * An RFC 5545 calendar file.
 *
 * Apple Calendar has no web deep link, so the only correct route is a real
 * `.ics` download — which Outlook desktop and every other client also accept.
 */
export function buildIcs(event: CalendarEvent, reference: string): string {
  const escape = (value: string) =>
    value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

  /**
   * RFC 5545 caps a content line at 75 octets; longer ones are split and
   * continued with a single leading space. A long address or description
   * silently corrupts the file in strict parsers without this.
   */
  const fold = (line: string) => {
    if (line.length <= 75) return line

    const parts = [line.slice(0, 75)]
    for (let i = 75; i < line.length; i += 74) {
      parts.push(` ${line.slice(i, i + 74)}`)
    }
    return parts.join('\r\n')
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TechOn//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${reference}@techontz.com`,
    `DTSTAMP:${toCalendarStamp(new Date())}`,
    `DTSTART:${toCalendarStamp(event.start)}`,
    `DTEND:${toCalendarStamp(event.end)}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(event.description)}`,
    `LOCATION:${escape(event.location)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .map(fold)
    .join('\r\n')
}

/** Triggers the `.ics` download. No-op outside the browser. */
export function downloadIcs(contents: string, filename: string): void {
  const blob = new Blob([contents], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  // Released on the next tick so Safari has finished reading the blob.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
