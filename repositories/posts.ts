import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore'

import { getDb, isLive } from '@/services/firebase/client'
import { NotConfiguredError } from '@/services/firebase/errors'
import {
  clean,
  createTimestamps,
  oneOf,
  str,
  strArray,
  toDate,
  updateTimestamp,
} from '@/services/firebase/converters'
import { COLLECTIONS } from '@/models/collections'
import { POST_STATUSES, type Post, type PostInput, type PostStatus } from '@/models/post'
import { deleteFile } from '@/repositories/storage'

/**
 * Blog.
 *
 * The architecture exists ahead of the public route: the model, repository,
 * rules and admin module are in place, so shipping the blog later is a page
 * that calls `listPublished()` rather than another migration.
 *
 * The slug is the document id, which makes `/blog/[slug]` a single document
 * read with no query or index.
 */

function mapPost(id: string, data: Record<string, unknown>): Post {
  return {
    id,
    slug: str(data.slug, id),
    title: str(data.title),
    excerpt: str(data.excerpt),
    body: str(data.body),
    coverImageUrl: str(data.coverImageUrl),
    coverImagePath: str(data.coverImagePath),
    tags: strArray(data.tags),
    authorName: str(data.authorName),
    locale: str(data.locale, 'en'),
    status: oneOf<PostStatus>(data.status, POST_STATUSES, 'draft'),
    publishedAt: data.publishedAt ? toDate(data.publishedAt) : null,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  }
}

/**
 * Published posts for a locale, newest first.
 *
 * `scheduled` posts are deliberately excluded here rather than filtered by
 * date in the query: publishing on a timer needs a scheduled function, and
 * pretending otherwise would let a post appear only when someone reloads.
 */
export async function listPublished(locale: string): Promise<Post[]> {
  if (!isLive()) return []

  try {
    const snapshot = await getDocs(
      query(
        collection(getDb(), COLLECTIONS.posts),
        where('status', '==', 'published'),
        where('locale', '==', locale),
        orderBy('publishedAt', 'desc'),
      ),
    )
    return snapshot.docs.map((document) => mapPost(document.id, document.data()))
  } catch {
    return []
  }
}

export async function listAllPosts(): Promise<Post[]> {
  if (!isLive()) return []

  const snapshot = await getDocs(
    query(collection(getDb(), COLLECTIONS.posts), orderBy('updatedAt', 'desc')),
  )
  return snapshot.docs.map((document) => mapPost(document.id, document.data()))
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!isLive()) return null

  const snapshot = await getDoc(doc(getDb(), COLLECTIONS.posts, slug))
  return snapshot.exists() ? mapPost(snapshot.id, snapshot.data()) : null
}

export async function savePost(input: PostInput, existingSlug?: string): Promise<string> {
  if (!isLive()) throw new NotConfiguredError('Blog')

  const db = getDb()

  // Renaming the slug moves the document, since the slug *is* the id.
  if (existingSlug && existingSlug !== input.slug) {
    await deleteDoc(doc(db, COLLECTIONS.posts, existingSlug))
  }

  const timestamps = existingSlug ? updateTimestamp() : createTimestamps()
  await setDoc(doc(db, COLLECTIONS.posts, input.slug), clean({ ...input, ...timestamps }), {
    merge: true,
  })

  return input.slug
}

export async function deletePost(slug: string): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Blog')

  const existing = await getPost(slug)
  if (existing?.coverImagePath) await deleteFile(existing.coverImagePath)

  await deleteDoc(doc(getDb(), COLLECTIONS.posts, slug))
}
