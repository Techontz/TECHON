/** Ids match the `testimonials.items.*` keys in every message bundle. */
export type TestimonialId = 'amina' | 'daniel' | 'claire' | 'thomas' | 'grace'

export interface Testimonial {
  id: TestimonialId
  /** Initials fill the avatar tile — no stock photography anywhere on the site. */
  initials: string
}

/**
 * Placeholder content. Names and companies are illustrative; replace with real
 * quotes before launch.
 */
export const testimonials: Testimonial[] = [
  { id: 'amina', initials: 'AR' },
  { id: 'daniel', initials: 'DM' },
  { id: 'claire', initials: 'CD' },
  { id: 'thomas', initials: 'TW' },
  { id: 'grace', initials: 'GO' },
]
