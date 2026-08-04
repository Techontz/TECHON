import type { ProjectCategory } from '@/data/projects'

/**
 * A portfolio project as stored in Firestore.
 *
 * `status` replaces the previous hardcoded flag: `published` is a real case
 * study, `template` is placeholder copy awaiting replacement, `comingSoon` is
 * built but not yet public, and `draft` is hidden from the site entirely.
 */

export const PROJECT_STATUSES = ['published', 'template', 'comingSoon', 'draft'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

/** Statuses the public site renders. `draft` is admin-only. */
export const PUBLIC_PROJECT_STATUSES: ProjectStatus[] = ['published', 'template', 'comingSoon']

export interface PortfolioProject {
  id: string
  title: string
  category: ProjectCategory
  /** Shown on the card. Falls back to the translated seed copy when empty. */
  description: string
  technologies: string[]
  /** Storage download URL. Empty renders the generated wireframe. */
  coverImageUrl: string
  /** Storage path, kept so the object can be deleted with the project. */
  coverImagePath: string
  projectUrl: string
  githubUrl: string
  featured: boolean
  status: ProjectStatus
  /** Ascending. Ties fall back to title. */
  displayOrder: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export type PortfolioInput = Omit<PortfolioProject, 'id' | 'createdAt' | 'updatedAt'>

export function emptyProject(): PortfolioInput {
  return {
    title: '',
    category: 'web',
    description: '',
    technologies: [],
    coverImageUrl: '',
    coverImagePath: '',
    projectUrl: '',
    githubUrl: '',
    featured: false,
    status: 'draft',
    displayOrder: 0,
    tags: [],
  }
}
