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
  bool,
  clean,
  createTimestamps,
  num,
  oneOf,
  str,
  strArray,
  toDate,
  updateTimestamp,
} from '@/services/firebase/converters'
import { COLLECTIONS } from '@/models/collections'
import {
  PROJECT_STATUSES,
  PUBLIC_PROJECT_STATUSES,
  type PortfolioInput,
  type PortfolioProject,
  type ProjectStatus,
} from '@/models/portfolio'
import { projectCategories, type ProjectCategory } from '@/data/projects'
import { deleteFile } from '@/repositories/storage'

/** Portfolio projects. Ordering is `displayOrder` ascending, then title. */

function mapProject(id: string, data: Record<string, unknown>): PortfolioProject {
  return {
    id,
    title: str(data.title),
    category: oneOf<ProjectCategory>(data.category, projectCategories, 'web'),
    description: str(data.description),
    technologies: strArray(data.technologies),
    coverImageUrl: str(data.coverImageUrl),
    coverImagePath: str(data.coverImagePath),
    projectUrl: str(data.projectUrl),
    githubUrl: str(data.githubUrl),
    featured: bool(data.featured),
    status: oneOf<ProjectStatus>(data.status, PROJECT_STATUSES, 'draft'),
    displayOrder: num(data.displayOrder, 999),
    tags: strArray(data.tags),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  }
}

/** Everything the public site may show. Drafts are excluded by the query. */
export async function listPublicProjects(): Promise<PortfolioProject[]> {
  if (!isLive()) return []

  try {
    const snapshot = await getDocs(
      query(
        collection(getDb(), COLLECTIONS.portfolio),
        where('status', 'in', PUBLIC_PROJECT_STATUSES),
        orderBy('displayOrder', 'asc'),
      ),
    )
    return snapshot.docs.map((document) => mapProject(document.id, document.data()))
  } catch {
    // The site falls back to the bundled projects rather than showing nothing.
    return []
  }
}

/** Every project, drafts included. Admin only — Security Rules enforce that. */
export async function listAllProjects(): Promise<PortfolioProject[]> {
  if (!isLive()) return []

  const snapshot = await getDocs(
    query(collection(getDb(), COLLECTIONS.portfolio), orderBy('displayOrder', 'asc')),
  )
  return snapshot.docs.map((document) => mapProject(document.id, document.data()))
}

export async function getProject(id: string): Promise<PortfolioProject | null> {
  if (!isLive()) return null

  const snapshot = await getDoc(doc(getDb(), COLLECTIONS.portfolio, id))
  return snapshot.exists() ? mapProject(snapshot.id, snapshot.data()) : null
}

/** Creates or updates. Passing an id updates; omitting it creates. */
export async function saveProject(input: PortfolioInput, id?: string): Promise<string> {
  if (!isLive()) throw new NotConfiguredError('Portfolio management')

  const reference = id
    ? doc(getDb(), COLLECTIONS.portfolio, id)
    : doc(collection(getDb(), COLLECTIONS.portfolio))

  const timestamps = id ? updateTimestamp() : createTimestamps()
  await setDoc(reference, clean({ ...input, ...timestamps }), { merge: true })

  return reference.id
}

/** Deletes the project and its cover image, so Storage does not accumulate orphans. */
export async function deleteProject(id: string): Promise<void> {
  if (!isLive()) throw new NotConfiguredError('Portfolio management')

  const existing = await getProject(id)
  if (existing?.coverImagePath) await deleteFile(existing.coverImagePath)

  await deleteDoc(doc(getDb(), COLLECTIONS.portfolio, id))
}

/** Persists a reordered list in one pass. */
export async function reorderProjects(ordered: Array<{ id: string; displayOrder: number }>) {
  if (!isLive()) throw new NotConfiguredError('Portfolio management')

  await Promise.all(
    ordered.map((item) =>
      setDoc(
        doc(getDb(), COLLECTIONS.portfolio, item.id),
        { displayOrder: item.displayOrder, ...updateTimestamp() },
        { merge: true },
      ),
    ),
  )
}
