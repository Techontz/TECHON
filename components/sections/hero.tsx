'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'
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
 * Composition follows the references: an announcement pill, a very large
 * medium-weight headline, a tight sub-paragraph, two calls to action, then the
 * product shot bleeding upward into the fold.
 *
 * The page still opens on plain white. The references use a full-bleed dark
 * panel here, but the brief specifies white backgrounds with purple accents,
 * so the weight comes from the type rather than from a colour field.
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
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* A single, very soft brand wash behind the headline. Not a gradient
          treatment — just enough tint to stop the fold reading as a blank sheet. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[36rem] opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(123, 25, 188, 0.07), transparent 70%)',
        }}
      />

      <div className="container-page relative">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <Link
              href="/#nova"
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-white py-1.5 pr-4 pl-1.5 shadow-xs transition-colors duration-200 hover:border-line-strong"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-white">
                <Sparkles className="size-3" aria-hidden />
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
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.06 }}
            className="type-display mt-8 text-balance sm:mt-10"
          >
            {t('title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.12 }}
            className="type-lead mx-auto mt-7 max-w-2xl"
          >
            {t('lead')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.18 }}
            className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
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

        {/* Product shot. Scales in very slightly rather than sliding, so the
            fold settles rather than moves. */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.24 }}
          className="relative mx-auto mt-16 max-w-5xl [perspective:1600px] sm:mt-24"
        >
          {/* Glow the dashboard floats on. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-10 top-10 -bottom-10 rounded-[48px] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(123,25,188,0.18),transparent_70%)] blur-2xl"
          />
          <HeroShot />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
          className="mx-auto mt-16 max-w-3xl sm:mt-20"
        >
          <dl className="grid grid-cols-3 gap-4 border-y border-line py-9">
            {heroStats.map((stat) => (
              <div key={stat.value.id} className="text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-[2rem] font-semibold tracking-[-0.03em] text-ink tabular-nums sm:text-[2.75rem]">
                    {stat.value.value}
                    {stat.value.suffix}
                  </span>
                  <span className="mt-1.5 block text-[0.8125rem] text-ink-muted">
                    {stat.label}
                  </span>
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

/**
 * The dashboard tilts back in 3D and lays flat as it scrolls into place, the
 * way a product launch page reveals its hero device.
 */
function HeroShot() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.3'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 16, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : 0.94, 1])

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, scale, transformOrigin: '50% 0%' }}
      className="relative shadow-[0_40px_100px_-30px_rgba(40,10,70,0.35)] [border-radius:12px]"
    >
      <BrowserFrame url="app.techontz.com">
        <ProductMockup className="h-[340px] sm:h-[480px]" />
      </BrowserFrame>
    </motion.div>
  )
}
