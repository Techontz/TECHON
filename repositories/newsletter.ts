import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import { getDb, isLive } from '@/services/firebase/client'
import { NotConfiguredError } from '@/services/firebase/errors'
import { bool, createTimestamps, str, toDate } from '@/services/firebase/converters'
import { COLLECTIONS } from '@/models/collections'
import type { NewsletterSubscriber } from '@/models/content'

/**
 * Newsletter subscribers.
 *
 * The email address, lowercased, is the document id — that makes subscribing
 * idempotent without a read, and makes a duplicate impossible by construction
 * rather than by a uniqueness check that can race.
 */

function emailId(email: string): string {
  return email.trim().toLowerCase()
}

function mapSubscriber(id: string, data: Record<string, unknown>): NewsletterSubscriber {
  return {
    id,
    email: str(data.email, id),
    locale: str(data.locale, 'en'),
    source: str(data.source, 'website'),
    subscribedAt: toDate(data.subscribedAt ?? data.createdAt),
    unsubscribedAt: data.unsubscribedAt ? toDate(data.unsubscribedAt) : undefined,
    active: bool(data.active, true),
  }
}

/**
 * Subscribes an address.
 *
 * Returns silently for a repeat subscription: telling a stranger that an
 * address is already on the list leaks whether that person is a subscriber.
 */
export async function subscribe(email: string, locale: string): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Newsletter')

  const id = emailId(email)
  await setDoc(
    doc(getDb(), COLLECTIONS.newsletter, id),
    {
      email: id,
      locale,
      source: 'website',
      active: true,
      subscribedAt: new Date(),
      ...createTimestamps(),
    },
    { merge: true },
  )
}

export async function listSubscribers(): Promise<NewsletterSubscriber[]> {
  if (!isLive()) return []

  const snapshot = await getDocs(
    query(collection(getDb(), COLLECTIONS.newsletter), orderBy('subscribedAt', 'desc')),
  )
  return snapshot.docs.map((document) => mapSubscriber(document.id, document.data()))
}

/** Soft delete — an unsubscribe must be auditable, so the row is kept. */
export async function unsubscribe(id: string): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Newsletter')
  await updateDoc(doc(getDb(), COLLECTIONS.newsletter, id), {
    active: false,
    unsubscribedAt: new Date(),
  })
}
