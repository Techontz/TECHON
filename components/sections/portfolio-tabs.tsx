'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useId } from 'react'

import { portfolioFilters, type PortfolioFilter } from '@/data/projects'
import { cn } from '@/lib/utils'

interface PortfolioTabsProps {
  active: PortfolioFilter
  onChange: (filter: PortfolioFilter) => void
  className?: string
}

/**
 * Category filter.
 *
 * The active pill is a single element moved between tabs with `layoutId`
 * rather than a background toggled per tab — the indicator physically travels,
 * which is what makes the control feel like an object.
 *
 * Scrolls horizontally on narrow screens instead of wrapping to ragged rows.
 */
export function PortfolioTabs({ active, onChange, className }: PortfolioTabsProps) {
  const t = useTranslations('portfolio')
  // Unique per instance, so the home page and portfolio page never animate
  // each other's indicator.
  const layoutId = useId()

  return (
    <div
      className={cn(
        '-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] pb-1',
        '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      <div
        role="tablist"
        aria-label={t('eyebrow')}
        className="inline-flex w-max gap-1 rounded-full border border-line bg-surface p-1"
      >
        {portfolioFilters.map((filter) => {
          const isActive = filter === active

          return (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(filter)}
              className={cn(
                'relative shrink-0 rounded-full px-3.5 py-1.5 text-[0.875rem] font-medium',
                'transition-colors duration-200',
                isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-full bg-white shadow-xs"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              ) : null}
              <span className="relative z-10 whitespace-nowrap">
                {t(`categories.${filter}`)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
