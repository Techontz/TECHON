/**
 * Blog architecture.
 *
 * The model, repository, rules and admin route exist now so publishing can be
 * switched on later without another migration. There is no public blog route
 * yet — adding one is a page that reads `listPublished()`.
 */

export const POST_STATUSES = ['draft', 'scheduled', 'published'] as const
export type PostStatus = (typeof POST_STATUSES)[number]

export interface Post {
  id: string
  /** URL segment. Unique; used as the document id. */
  slug: string
  title: string
  excerpt: string
  /** Markdown. Rendered at read time, so the source stays portable. */
  body: string
  coverImageUrl: string
  coverImagePath: string
  tags: string[]
  authorName: string
  /** BCP 47. Lets the blog be written per-language without a translation matrix. */
  locale: string
  status: PostStatus
  /** When `scheduled`, the moment it becomes public. */
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>

/** Lowercase, hyphenated, ASCII — safe as both a URL and a document id. */
export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    // Strips the combining marks NFD just separated out, so "Réserver" → "reserver".
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
