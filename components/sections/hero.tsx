'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { ProductMockup } from '@/components/sections/product-mockup'
import { ActionLink } from '@/components/ui/action-link'
import { BrowserFrame } from '@/components/ui/device-frame'
import { Link } from '@/i18n/navigation'
import { ease } from '@/lib/motion'
import { stats } from '@/data/why'

/**
 * The hero.
 *
 * No background treatment at all — the page opens on plain white, and the
 * headline is the only thing competing for attention. Everything moves once,
 * 12px, on load; there is nothing looping.
 */
export function Hero() {
  const t = useTranslations('hero')
  const logos = useTranslations('logos')

  const heroStats = [
    { value: stats[0], label: t('stat1') },
    { value: stats[1], label: t('stat2') },
    { value: stats[2], label: t('stat3') },
  ]

  return (
    <section className="pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          {/* Product announcement */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <Link
              href="/#nova"
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-white py-1 pr-3 pl-1 transition-colors duration-200 hover:border-line-strong"
            >
              <span className="rounded-full bg-brand px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-white">
                {t('badge')}
              </span>
              <span className="text-[0.8125rem] text-ink-muted">{t('badgeText')}</span>
              <ArrowRight
                className="size-3.5 text-ink-subtle transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.06 }}
            className="type-display mt-7 text-balance"
          >
            {t('title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.12 }}
            className="type-lead mx-auto mt-6 max-w-2xl"
          >
            {t('lead')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.18 }}
            className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
          >
            <ActionLink href="/book" size="lg">
              {t('primary')}
            </ActionLink>
            <ActionLink
              href="/portfolio"
              variant="secondary"
              size="lg"
              icon={<ArrowRight className="size-4" aria-hidden />}
            >
              {t('secondary')}
            </ActionLink>
          </motion.div>
        </div>

        {/* Product shot */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.24 }}
          className="mx-auto mt-16 max-w-5xl sm:mt-20"
        >
          <BrowserFrame url="app.techon.co.tz">
            <ProductMockup className="h-[300px] sm:h-[420px]" />
          </BrowserFrame>
        </motion.div>

        {/* Credibility strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
          className="mx-auto mt-16 max-w-3xl sm:mt-20"
        >
          <dl className="grid grid-cols-3 gap-4 border-y border-line py-8">
            {heroStats.map((stat) => (
              <div key={stat.value.id} className="text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-[1.75rem] font-semibold tracking-[-0.03em] text-ink tabular-nums sm:text-[2.25rem]">
                    {stat.value.value}
                    {stat.value.suffix}
                  </span>
                  <span className="mt-1 block text-[0.8125rem] text-ink-muted">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-center text-[0.875rem] text-ink-subtle">{logos('title')}</p>
        </motion.div>
      </div>
    </section>
  )
}
