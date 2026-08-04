'use client'

import { ArrowUpRight, Github } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Tag } from '@/components/ui/tag'
import { ProjectThumb } from '@/components/ui/project-thumb'
import { Link } from '@/i18n/navigation'
import type { Project, ProjectStatus } from '@/data/projects'
import { cn } from '@/lib/utils'

const statusTone: Record<ProjectStatus, 'success' | 'brand' | 'muted'> = {
  live: 'success',
  comingSoon: 'brand',
  template: 'muted',
}

interface ProjectCardProps {
  project: Project
  priority?: boolean
}

/**
 * A portfolio entry.
 *
 * Both actions always render — disabled where no URL exists yet — so cards
 * keep identical heights and the grid never develops ragged footers as real
 * links get filled in over time.
 */
export function ProjectCard({ project, priority }: ProjectCardProps) {
  const t = useTranslations('portfolio')

  return (
    <article className="card-surface card-hover group flex h-full flex-col overflow-hidden rounded-[10px]">
      <div className="relative aspect-[16/10] w-full border-b border-line">
        <ProjectThumb project={project} className="absolute inset-0" priority={priority} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="type-h3 text-[1.0625rem]">{project.title}</h3>
          <Tag tone={statusTone[project.status]} className="shrink-0">
            {t(`status.${project.status}`)}
          </Tag>
        </div>

        <p className="mt-1 text-[0.8125rem] text-ink-subtle">
          {t(`categories.${project.category}`)}
        </p>

        <p className="type-small mt-3">{t(`items.${project.id}`)}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center gap-2 pt-5">
          <CardAction
            href={project.href}
            label={t('view')}
            title={project.title}
            icon={<ArrowUpRight className="size-3.5" aria-hidden />}
            primary
          />
          <CardAction
            href={project.github}
            label={t('code')}
            title={project.title}
            icon={<Github className="size-3.5" aria-hidden />}
          />
        </div>
      </div>
    </article>
  )
}

interface CardActionProps {
  href?: string
  label: string
  title: string
  icon: React.ReactNode
  primary?: boolean
}

function CardAction({ href, label, title, icon, primary }: CardActionProps) {
  const base = cn(
    'inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[8px]',
    'text-[0.8125rem] font-medium transition-colors duration-200',
  )

  if (!href) {
    return (
      <span
        aria-disabled
        className={cn(base, 'cursor-not-allowed border border-line bg-surface text-ink-subtle/60')}
      >
        {icon}
        {label}
      </span>
    )
  }

  const isExternal = href.startsWith('http')

  return (
    <Link
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      // The visible label repeats on every card, so the accessible name carries
      // the project title to keep a link list navigable.
      aria-label={`${label} — ${title}`}
      className={cn(
        base,
        primary
          ? 'bg-ink text-white hover:bg-ink/85'
          : 'border border-line text-ink-muted hover:border-line-strong hover:text-ink',
      )}
    >
      {icon}
      {label}
    </Link>
  )
}
