import { collection, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore'

import { getDb, isLive } from '@/services/firebase/client'
import { NotConfiguredError } from '@/services/firebase/errors'
import { bool, num, oneOf, str, updateTimestamp } from '@/services/firebase/converters'
import { COLLECTIONS } from '@/models/collections'
import type { Consultation, ConsultationIcon, ConsultationId } from '@/models/consultation'
import { SEED_CONSULTATIONS } from '@/data/seed/consultations'

/**
 * Consultation products and their pricing.
 *
 * Prices live in Firestore. The seed constant is used only when Firebase is
 * not configured at all — a deployment with credentials always reads live
 * values, so changing a price in the admin panel changes it on the site with
 * no deploy.
 */

const ICONS: ConsultationIcon[] = ['video', 'sparkles', 'building']

function mapConsultation(id: string, data: Record<string, unknown>): Consultation {
  const prices = (data.prices ?? {}) as Record<string, unknown>

  return {
    id: id as ConsultationId,
    icon: oneOf<ConsultationIcon>(data.icon, ICONS, 'video'),
    durationMinutes: num(data.durationMinutes, 30),
    currency: str(data.currency, 'TZS'),
    prices: {
      office: num(prices.office),
      online: num(prices.online),
    },
    order: num(data.order, 99),
    recommended: bool(data.recommended),
    active: bool(data.active, true),
  }
}

/** Active consultations, in display order. Falls back to seed when offline. */
export async function listConsultations(): Promise<Consultation[]> {
  if (!isLive()) return SEED_CONSULTATIONS.filter((item) => item.active)

  const snapshot = await getDocs(
    query(collection(getDb(), COLLECTIONS.consultations), orderBy('order', 'asc')),
  )

  // An empty collection means "not seeded yet" rather than "no products",
  // so the page stays usable instead of offering nothing to book.
  if (snapshot.empty) return SEED_CONSULTATIONS.filter((item) => item.active)

  return snapshot.docs
    .map((document) => mapConsultation(document.id, document.data()))
    .filter((item) => item.active)
}

/** Every consultation including inactive ones — the admin editor needs those. */
export async function listAllConsultations(): Promise<Consultation[]> {
  if (!isLive()) return SEED_CONSULTATIONS

  const snapshot = await getDocs(
    query(collection(getDb(), COLLECTIONS.consultations), orderBy('order', 'asc')),
  )
  if (snapshot.empty) return SEED_CONSULTATIONS

  return snapshot.docs.map((document) => mapConsultation(document.id, document.data()))
}

export async function saveConsultation(consultation: Consultation): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Consultation pricing')

  const { id, ...rest } = consultation
  await setDoc(
    doc(getDb(), COLLECTIONS.consultations, id),
    { ...rest, ...updateTimestamp() },
    { merge: true },
  )
}
