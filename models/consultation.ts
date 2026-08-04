import type { MeetingMode } from '@/data/booking-options'

/**
 * Consultation products.
 *
 * Price is a matrix of consultation × meeting mode: an online session costs
 * less than one that occupies a room. Amounts are integer minor units with an
 * explicit currency — never formatted strings — so a payment provider can be
 * handed the figure directly and `Intl` can localise the display.
 */

export type ConsultationId = 'discovery' | 'aiStrategy' | 'businessStrategy'

/** Icon key, resolved to a component in the UI. Firestore stores no components. */
export type ConsultationIcon = 'video' | 'sparkles' | 'building'

export interface Consultation {
  id: ConsultationId
  icon: ConsultationIcon
  durationMinutes: number
  currency: string
  /** Minor units per meeting mode. `0` means free. */
  prices: Record<MeetingMode, number>
  /** Ordering in the picker. */
  order: number
  /** Highlighted as the usual starting point. */
  recommended: boolean
  /** Hidden from the public picker without being deleted. */
  active: boolean
}

export function priceFor(consultation: Consultation, mode: MeetingMode | null): number | null {
  if (!mode) return null
  return consultation.prices[mode]
}

/** The cheapest mode, used on the card before a mode has been chosen. */
export function lowestPrice(consultation: Consultation): number {
  return Math.min(...Object.values(consultation.prices))
}

export function isFree(consultation: Consultation): boolean {
  return Object.values(consultation.prices).every((price) => price === 0)
}

/** Formats minor units for display. Returns null for free, so callers can badge it. */
export function formatMoney(minor: number, currency: string, locale: string): string | null {
  if (minor === 0) return null

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(minor)
}
