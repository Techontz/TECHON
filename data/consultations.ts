import { Building2, Sparkles, Video, type LucideIcon } from 'lucide-react'

/**
 * The three bookable consultation types.
 *
 * Prices are stored as integer minor units with an explicit currency, never as
 * pre-formatted strings — that is what lets a payment provider (Stripe,
 * Flutterwave, PayPal) be wired in later without touching the UI, and lets the
 * amount be localised per visitor.
 */

export type ConsultationId = 'discovery' | 'aiStrategy' | 'businessStrategy'

export interface Consultation {
  id: ConsultationId
  icon: LucideIcon
  /** Minutes. Drives both the UI and the calendar event's end time. */
  durationMinutes: number
  /** Cents/senti. `0` means free. */
  priceMinor: number
  currency: 'TZS'
  /** Highlighted as the common starting point. */
  recommended?: boolean
}

export const consultations: Consultation[] = [
  {
    id: 'discovery',
    icon: Video,
    durationMinutes: 15,
    priceMinor: 0,
    currency: 'TZS',
    recommended: true,
  },
  {
    id: 'aiStrategy',
    icon: Sparkles,
    durationMinutes: 60,
    priceMinor: 100_000,
    currency: 'TZS',
  },
  {
    id: 'businessStrategy',
    icon: Building2,
    durationMinutes: 60,
    priceMinor: 300_000,
    currency: 'TZS',
  },
]

export function getConsultation(id: ConsultationId | null): Consultation | undefined {
  return consultations.find((consultation) => consultation.id === id)
}

/**
 * Formats a price for display. Uses `Intl` so TZS renders correctly in every
 * locale the site supports.
 */
export function formatPrice(consultation: Consultation, locale: string): string | null {
  if (consultation.priceMinor === 0) return null

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: consultation.currency,
    maximumFractionDigits: 0,
  }).format(consultation.priceMinor)
}
