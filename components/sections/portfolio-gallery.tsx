'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Reveal } from '@/components/motion/reveal'
import { PortfolioTabs } from '@/components/sections/portfolio-tabs'
import { ProjectCard } from '@/components/sections/project-card'
import { ActionLink } from '@/components/ui/action-link'
import { Eyebrow } from '@/components/ui/section'
import { Link } from '@/i18n/navigation'
import { filterProjects, projects, type PortfolioFilter } from '@/data/projects'
import { ease } from '@/lib/motion'

/** The complete catalogue, filtered client-side. */
export function PortfolioGallery() {
  const t = useTranslations('portfolioPage')
  const p = useTranslations('portfolio')
  const [filter, setFilter] = useState<PortfolioFilter>('all')

  const visible = filterProjects(filter)

  return (
    <>
      <section className="pt-14 pb-10 sm:pt-20 sm:pb-14">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-[0.9375rem] text-ink-muted transition-colors hover:text-ink"
            >
              <ArrowLeft
                className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                aria-hidden
              />
              {t('back')}
            </Link>

            <Eyebrow className="mt-8">{t('eyebrow')}</Eyebrow>
            <h1 className="type-h1 mt-3">{t('title')}</h1>
            <p className="type-lead mt-5">{t('lead')}</p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="container-page">
          {/* Sticky so the filter stays reachable through a long grid. The
              offset clears the sticky header above it. */}
          <div className="sticky top-14 sm:top-[3.75rem] z-30 -mx-[var(--gutter)] border-b border-line bg-white/90 px-[var(--gutter)] py-4 backdrop-blur-md">
            <PortfolioTabs active={filter} onChange={setFilter} />
          </div>

          <p className="mt-6 mb-6 text-[0.875rem] text-ink-subtle">
            {p('showing', { count: visible.length, total: projects.length })}
          </p>

          <motion.ul
            layout
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            transition={{ duration: 0.4, ease }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((project, index) => (
                <motion.li
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease }}
                >
                  {/* Only the first row is above the fold. */}
                  <ProjectCard project={project} priority={index < 3} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          {visible.length === 0 ? (
            <p className="type-small py-16 text-center">{p('empty')}</p>
          ) : null}

          <Reveal className="mt-20 sm:mt-24">
            <div className="card-surface rounded-[10px] px-6 py-12 text-center sm:px-10 sm:py-16">
              <h2 className="type-h2 mx-auto max-w-lg">{t('ctaTitle')}</h2>
              <p className="type-lead mx-auto mt-4 max-w-lg">{t('ctaLead')}</p>

              <div className="mt-8 flex justify-center">
                <ActionLink href="/#contact" size="lg">
                  {t('ctaButton')}
                </ActionLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
