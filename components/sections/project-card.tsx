'use client'

import { ArrowUpRight, Smartphone } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { ProjectThumb } from '@/components/ui/project-thumb'
import { Tag } from '@/components/ui/tag'
import { Link } from '@/i18n/navigation'
import type { Project, ProjectLink, ProjectLinkKind } from '@/data/projects'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  priority?: boolean
}

/**
 * A shipped project: real cover, the product's own icon, and a link to every
 * place it lives — website, Google Play, App Store.
 *
 * The cover links to the project's first destination so the largest target on
 * the card is also the most useful one.
 */
export function ProjectCard({ project, priority }: ProjectCardProps) {
  const t = useTranslations('portfolio')
  const primary = project.links[0]

  const cover = (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line">
      <ProjectThumb
        project={project}
        priority={priority}
        className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
    </div>
  )

  return (
    <article className="card-surface card-hover group flex h-full flex-col overflow-hidden rounded-card">
      {primary ? (
        <ProjectAnchor link={primary} label={`${project.title}: ${t(`links.${primary.kind}`)}`}>
          {cover}
        </ProjectAnchor>
      ) : (
        cover
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          {project.icon ? (
            <span className="relative size-11 shrink-0 overflow-hidden rounded-[10px] border border-line bg-white">
              <Image src={project.icon} alt="" fill sizes="44px" className="object-contain" />
            </span>
          ) : null}
          <div className="min-w-0">
            <h3 className="type-h3 truncate text-[1.0625rem]">{project.title}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-[0.8125rem] text-ink-subtle">
              <span className="size-1.5 rounded-full bg-success" aria-hidden />
              {t(`sectors.${project.sector}`)}
            </p>
          </div>
        </div>

        <p className="type-small mt-4">{t(`items.${project.id}`)}</p>

        {project.appComingSoon ? (
          <div className="mt-4">
            <Tag tone="brand">
              <Smartphone className="size-3" aria-hidden />
              {t('appComingSoon')}
            </Tag>
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {project.links.map((link, index) => (
            <ProjectAnchor
              key={link.href}
              link={link}
              label={`${project.title}: ${t(`links.${link.kind}`)}`}
              className={cn(
                'inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-3.5',
                'text-[0.8125rem] font-medium transition-colors duration-200',
                index === 0
                  ? 'bg-ink text-white hover:bg-ink/85'
                  : 'border border-line text-ink-muted hover:border-line-strong hover:text-ink',
              )}
            >
              <StoreGlyph kind={link.kind} />
              {t(`links.${link.kind}`)}
            </ProjectAnchor>
          ))}
        </div>
      </div>
    </article>
  )
}

function ProjectAnchor({
  link,
  label,
  className,
  children,
}: {
  link: ProjectLink
  label: string
  className?: string
  children: React.ReactNode
}) {
  const isExternal = link.href.startsWith('http')

  return (
    <Link
      href={link.href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      aria-label={label}
      className={cn('block', className)}
    >
      {children}
    </Link>
  )
}

/** Store marks drawn inline: Google Play and Apple. Paths from simple-icons (CC0). */
function StoreGlyph({ kind }: { kind: ProjectLinkKind }) {
  if (kind === 'website') return <ArrowUpRight className="size-3.5" aria-hidden />

  const path =
    kind === 'ios'
      ? 'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701'
      : 'M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z'

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-3.5">
      <path d={path} />
    </svg>
  )
}
