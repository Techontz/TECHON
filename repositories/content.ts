import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'

import { getDb, isLive } from '@/services/firebase/client'
import { NotConfiguredError } from '@/services/firebase/errors'
import { bool, num, str, updateTimestamp } from '@/services/firebase/converters'
import { COLLECTIONS, CONTENT_DOCS, type ContentDocId } from '@/models/collections'
import type {
  ContactContent,
  HeroContent,
  NovaContent,
  ServicesContent,
  SiteSettings,
  Testimonial,
} from '@/models/content'
import {
  SEED_CONTACT,
  SEED_HERO,
  SEED_NOVA,
  SEED_SERVICES,
  SEED_SETTINGS,
  SEED_TESTIMONIALS,
} from '@/data/seed/content'

/**
 * Editable page content.
 *
 * Each singleton is read with its seed as the fallback, and merged shallowly
 * over it — so a document written before a field existed still yields a
 * complete object, and adding a field never requires a data migration.
 */

async function readSingleton<T extends object>(id: ContentDocId | string, fallback: T): Promise<T> {
  if (!isLive()) return fallback

  try {
    const snapshot = await getDoc(doc(getDb(), COLLECTIONS.content, id))
    if (!snapshot.exists()) return fallback
    return { ...fallback, ...(snapshot.data() as Partial<T>) }
  } catch {
    // Content is never worth failing a page render over.
    return fallback
  }
}

async function writeSingleton(id: ContentDocId | string, data: object): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Content editing')
  await setDoc(doc(getDb(), COLLECTIONS.content, id), { ...data, ...updateTimestamp() }, { merge: true })
}

/* ---------------------------------------------------------------- Singletons */

export const getHero = () => readSingleton<HeroContent>(CONTENT_DOCS.hero, SEED_HERO)
export const saveHero = (data: HeroContent) => writeSingleton(CONTENT_DOCS.hero, data)

export const getServices = () => readSingleton<ServicesContent>(CONTENT_DOCS.services, SEED_SERVICES)
export const saveServices = (data: ServicesContent) => writeSingleton(CONTENT_DOCS.services, data)

export const getNova = () => readSingleton<NovaContent>(CONTENT_DOCS.nova, SEED_NOVA)
export const saveNova = (data: NovaContent) => writeSingleton(CONTENT_DOCS.nova, data)

export const getContact = () => readSingleton<ContactContent>(CONTENT_DOCS.contact, SEED_CONTACT)
export const saveContact = (data: ContactContent) => writeSingleton(CONTENT_DOCS.contact, data)

export const getSettings = () => readSingleton<SiteSettings>(CONTENT_DOCS.settings, SEED_SETTINGS)
export const saveSettings = (data: SiteSettings) => writeSingleton(CONTENT_DOCS.settings, data)

/* -------------------------------------------------------------- Testimonials */

function mapTestimonial(id: string, data: Record<string, unknown>): Testimonial {
  return {
    id,
    quote: str(data.quote),
    name: str(data.name),
    role: str(data.role),
    company: str(data.company),
    initials: str(data.initials),
    order: num(data.order, 99),
    published: bool(data.published, true),
  }
}

export async function listTestimonials(includeUnpublished = false): Promise<Testimonial[]> {
  if (!isLive()) {
    return includeUnpublished ? SEED_TESTIMONIALS : SEED_TESTIMONIALS.filter((t) => t.published)
  }

  try {
    const snapshot = await getDocs(
      query(collection(getDb(), COLLECTIONS.testimonials), orderBy('order', 'asc')),
    )
    if (snapshot.empty) {
      return includeUnpublished ? SEED_TESTIMONIALS : SEED_TESTIMONIALS.filter((t) => t.published)
    }

    const all = snapshot.docs.map((document) => mapTestimonial(document.id, document.data()))
    return includeUnpublished ? all : all.filter((item) => item.published)
  } catch {
    return SEED_TESTIMONIALS.filter((t) => t.published)
  }
}

export async function saveTestimonial(testimonial: Testimonial): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Testimonials')

  const { id, ...rest } = testimonial
  const reference = id
    ? doc(getDb(), COLLECTIONS.testimonials, id)
    : doc(collection(getDb(), COLLECTIONS.testimonials))

  await setDoc(reference, { ...rest, ...updateTimestamp() }, { merge: true })
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Testimonials')
  await deleteDoc(doc(getDb(), COLLECTIONS.testimonials, id))
}
