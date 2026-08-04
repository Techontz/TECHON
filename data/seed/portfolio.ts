import { projects } from '@/data/projects'
import type { PortfolioProject, ProjectStatus } from '@/models/portfolio'

/**
 * Seed portfolio, derived from the existing `data/projects.ts` rather than
 * duplicated — the thirty-five entries already reviewed stay the single
 * source, and seeding cannot drift from them.
 */

const STATUS_MAP: Record<string, ProjectStatus> = {
  live: 'published',
  comingSoon: 'comingSoon',
  template: 'template',
}

export function buildSeedPortfolio(): Array<Omit<PortfolioProject, 'createdAt' | 'updatedAt'>> {
  return projects.map((project, index) => ({
    id: project.id,
    title: project.title,
    category: project.category,
    // Left blank so the translated description in `messages/` is used until an
    // admin writes a real case study.
    description: '',
    technologies: [...project.tags],
    coverImageUrl: '',
    coverImagePath: '',
    projectUrl: project.href ?? '',
    githubUrl: project.github ?? '',
    featured: Boolean(project.featured),
    status: STATUS_MAP[project.status] ?? 'draft',
    // Tens leave room to insert between two projects without renumbering.
    displayOrder: (index + 1) * 10,
    tags: [],
  }))
}
