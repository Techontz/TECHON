'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { PortfolioTabs } from '@/components/sections/portfolio-tabs'
import { ProjectCard } from '@/components/sections/project-card'
import { ActionLink } from '@/components/ui/action-link'
import { Section, SectionHeader } from '@/components/ui/section'
import { filterProjects, projects, type PortfolioFilter } from '@/data/projects'
import { ease } from '@/lib/motion'

/** Home-page preview size. The full catalogue lives on /portfolio. */
const PREVIEW_COUNT = 6

export function Portfolio() {
  const t = useTranslations('portfolio')
  const [filter, setFilter] = useState<PortfolioFilter>('all')

  const matching = filterProjects(filter)
  const visible = matching.slice(0, PREVIEW_COUNT)

  return (
    <Section id="work" tone="subtle" divided>
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
        action={
          <ActionLink
            href="/portfolio"
            variant="secondary"
            icon={<ArrowRight className="size-4" aria-hidden />}
          >
            {t('viewAll')}
          </ActionLink>
        }
      />

      <div className="mt-12 sm:mt-14">
        <PortfolioTabs active={filter} onChange={setFilter} />
      </div>

      {/* `popLayout` lets a departing card leave the flow immediately, so the
          survivors slide into place rather than waiting out the exit. */}
      <motion.ul
        layout
        className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        transition={{ duration: 0.4, ease }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project) => (
            <motion.li
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease }}
            >
              <ProjectCard project={project} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {matching.length === 0 ? (
        <p className="py-16 text-center type-small">{t('empty')}</p>
      ) : null}

      <p className="mt-10 text-center text-[0.875rem] text-ink-subtle">
        {t('showing', { count: visible.length, total: projects.length })}
      </p>
    </Section>
  )
}
