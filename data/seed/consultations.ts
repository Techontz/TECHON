import type { Consultation } from '@/models/consultation'

/**
 * Seed pricing.
 *
 * This is what `npm run seed` writes into `consultations/`, and what the
 * booking page falls back to when Firebase is not configured — so the site
 * works on day one and becomes Firestore-driven the moment credentials exist.
 *
 * Once seeded, these values are never read again: prices come from Firestore,
 * and editing them here has no effect on a configured deployment.
 */
export const SEED_CONSULTATIONS: Consultation[] = [
  {
    id: 'discovery',
    icon: 'video',
    durationMinutes: 15,
    currency: 'TZS',
    prices: { office: 0, online: 0 },
    order: 1,
    recommended: true,
    active: true,
  },
  {
    id: 'aiStrategy',
    icon: 'sparkles',
    durationMinutes: 60,
    currency: 'TZS',
    // An online session costs less than one that occupies a room.
    prices: { office: 100_000, online: 50_000 },
    order: 2,
    recommended: false,
    active: true,
  },
  {
    id: 'businessStrategy',
    icon: 'building',
    durationMinutes: 60,
    currency: 'TZS',
    prices: { office: 300_000, online: 150_000 },
    order: 3,
    recommended: false,
    active: true,
  },
]
