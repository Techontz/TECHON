/**
 * Firestore collection paths.
 *
 * Declared once so a rename is a single edit and every Security Rule below has
 * an exact counterpart in code. Nothing outside `repositories/` should build a
 * path from a string literal.
 */
export const COLLECTIONS = {
  /** Admin allow-list. Membership is what Security Rules check. */
  admins: 'admins',

  bookings: 'bookings',
  /** One document per taken slot. Its id is the uniqueness constraint. */
  slotLocks: 'slotLocks',
  /** Per-day overrides written by an admin: closures, holidays, blocked slots. */
  availability: 'availability',

  consultations: 'consultations',
  portfolio: 'portfolio',
  testimonials: 'testimonials',
  newsletter: 'newsletter',
  posts: 'posts',

  /** Singleton documents for editable page content. */
  content: 'content',
} as const

/** Document ids inside the `content` collection. */
export const CONTENT_DOCS = {
  hero: 'hero',
  services: 'services',
  nova: 'nova',
  contact: 'contact',
  settings: 'settings',
} as const

export type ContentDocId = (typeof CONTENT_DOCS)[keyof typeof CONTENT_DOCS]

/**
 * Deterministic id for a slot lock.
 *
 * This is the whole double-booking guard: two people choosing 2026-09-14 at
 * 10:00 generate the same id, and Firestore permits only one `create` for a
 * given document path.
 */
export function slotLockId(date: string, time: string): string {
  return `${date}_${time}`
}
