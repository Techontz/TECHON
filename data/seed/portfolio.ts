import { projects } from '@/data/projects'
import type { PortfolioProject, ProjectStatus } from '@/models/portfolio'

/**
 * Seed portfolio, derived from the existing `data/projects.ts` rather than
 * duplicated — the shipped projects stay the single
 * source, and seeding cannot drift from them.
 */

export function buildSeedPortfolio(): Array<Omit<PortfolioProject, 'createdAt' | 'updatedAt'>> {
  return projects.map((project, index) => ({
    id: project.id,
    title: project.title,
    category: project.categories[0],
    // Left blank so the translated description in `messages/` is used until an
    // admin writes a real case study.
    description: '',
    technologies: [],
    coverImageUrl: project.image ?? '',
    coverImagePath: '',
    projectUrl: project.links[0]?.href ?? '',
    githubUrl: '',
    featured: Boolean(project.featured),
    status: 'published' as ProjectStatus,
    // Tens leave room to insert between two projects without renumbering.
    displayOrder: (index + 1) * 10,
    tags: [],
  }))
}
