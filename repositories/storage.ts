import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadTask,
} from 'firebase/storage'

import { getBucket, isLive } from '@/services/firebase/client'
import { NotConfiguredError } from '@/services/firebase/errors'

/**
 * Firebase Storage.
 *
 * Paths are namespaced by feature so Storage Rules can grant per-prefix
 * access, and so a stray upload can never land at the bucket root.
 */
export const STORAGE_PATHS = {
  portfolio: 'portfolio',
  nova: 'nova',
  hero: 'hero',
  posts: 'posts',
  team: 'team',
} as const

export type StorageArea = (typeof STORAGE_PATHS)[keyof typeof STORAGE_PATHS]

export interface UploadResult {
  url: string
  path: string
}

/** Rejected before upload so a bad file never consumes bandwidth or quota. */
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return 'unsupportedType'
  if (file.size > MAX_UPLOAD_BYTES) return 'tooLarge'
  return null
}

/** Timestamped, slugged filename — collision-free and readable in the console. */
function buildPath(area: StorageArea, file: File): string {
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(-60)

  return `${area}/${Date.now()}-${safeName}`
}

/**
 * Uploads an image, reporting progress.
 *
 * Resumable rather than simple upload: a cover image over a Tanzanian mobile
 * connection benefits from resumption, and progress is what makes a slow
 * upload tolerable rather than looking frozen.
 */
export function uploadImage(
  area: StorageArea,
  file: File,
  onProgress?: (percent: number) => void,
): { task: UploadTask; done: Promise<UploadResult> } {
  if (!isLive()) throw new NotConfiguredError('File upload')

  const path = buildPath(area, file)
  const task = uploadBytesResumable(ref(getBucket(), path), file, {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000, immutable',
  })

  const done = new Promise<UploadResult>((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => {
        if (!onProgress) return
        onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
      },
      reject,
      async () => resolve({ url: await getDownloadURL(task.snapshot.ref), path }),
    )
  })

  return { task, done }
}

/** Deleting a missing object is treated as success — the desired state holds. */
export async function deleteFile(path: string): Promise<void> {
  if (!isLive() || !path) return

  try {
    await deleteObject(ref(getBucket(), path))
  } catch (error) {
    if ((error as { code?: string })?.code !== 'storage/object-not-found') throw error
  }
}
