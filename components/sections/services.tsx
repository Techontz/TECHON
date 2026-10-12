'use client'

import { motion, useInView, useReducedMotion, type PanInfo } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Section, SectionHeader } from '@/components/ui/section'
import { Link } from '@/i18n/navigation'
import { services } from '@/data/services'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * The twelve services as a shelf of book covers.
 *
 * One cover faces the visitor; the rest turn away on either side in 3D, so all
 * twelve fit in the height of a single card. Swipe, drag, the arrows or the
 * keyboard move the shelf; it also advances on its own while on screen, and
 * only holds still while someone is dragging it.
 */

/** Cover colours: two stops each, light enough to keep the page airy. */
const COVERS = [
  ['#8B2BD0', '#5B0F95'],
  ['#2A2A30', '#0E0E12'],
  ['#3B5BDB', '#1E3A8A'],
  ['#0F9D8F', '#0B5F57'],
  ['#E8590C', '#A63E05'],
  ['#7B19BC', '#3B0A5E'],
  ['#1C7ED6', '#0B4F8A'],
  ['#2F9E44', '#1B5E28'],
  ['#C2255C', '#7A1238'],
  ['#5F3DC4', '#33207A'],
  ['#495057', '#212529'],
  ['#F08C00', '#9C5A00'],
] as const

const AUTOPLAY_MS = 3200

export function Services() {
  const t = useTranslations('services')
  const reduced = Boolean(useReducedMotion())
  const shelfRef = useRef<HTMLDivElement>(null)
  const inView = useInView(shelfRef, { margin: '-15% 0px' })

  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
  const count = services.length

  const go = useCallback((step: number) => setActive((i) => (i + step + count) % count), [count])

  useEffect(() => {
    if (reduced || dragging || !inView) return
    const timer = window.setTimeout(() => go(1), AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [active, reduced, dragging, inView, go])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setDragging(false)
    if (info.offset.x < -40 || info.velocity.x < -300) go(1)
    else if (info.offset.x > 40 || info.velocity.x > 300) go(-1)
  }

  return (
    <Section id="services" divided>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

        <div className="flex shrink-0 items-center gap-2">
          <ShelfButton label={t('prev')} onClick={() => go(-1)}>
            <ArrowLeft className="size-4" aria-hidden />
          </ShelfButton>
          <ShelfButton label={t('next')} onClick={() => go(1)}>
            <ArrowRight className="size-4" aria-hidden />
          </ShelfButton>
        </div>
      </div>

      <div
        ref={shelfRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={t('title')}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') go(1)
          if (event.key === 'ArrowLeft') go(-1)
        }}
        className="relative mt-10 h-[400px] overflow-hidden outline-none [perspective:1400px] sm:mt-12 sm:h-[440px]"
      >
        <motion.div
          className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragStart={() => setDragging(true)}
          onDragEnd={onDragEnd}
        >
          {services.map((service, index) => {
            // Shortest signed distance around the ring, so the shelf wraps.
            let offset = index - active
            if (offset > count / 2) offset -= count
            if (offset < -count / 2) offset += count
            const distance = Math.abs(offset)
            const visible = distance <= 3

            return (
              <motion.div
                key={service.id}
                className="absolute top-1/2 left-1/2 w-[240px] sm:w-[270px]"
                style={{ zIndex: 20 - distance, transformStyle: 'preserve-3d' }}
                initial={false}
                animate={{
                  x: `calc(-50% + ${offset * 62}%)`,
                  y: '-50%',
                  rotateY: offset === 0 ? 0 : offset > 0 ? -38 : 38,
                  scale: 1 - Math.min(distance, 3) * 0.1,
                  z: -distance * 90,
                  opacity: visible ? 1 - Math.max(0, distance - 1) * 0.3 : 0,
                }}
                transition={{ duration: reduced ? 0 : 0.7, ease }}
                aria-hidden={offset !== 0}
              >
                <Cover
                  index={index}
                  isActive={offset === 0}
                  onSelect={() => setActive(index)}
                  title={t(`items.${service.id}.title`)}
                  description={t(`items.${service.id}.description`)}
                  cta={t('cta')}
                  icon={service.icon}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Position: one dot per cover, the current one stretched. */}
      <div className="mt-6 flex justify-center gap-1.5">
        {services.map((service, index) => (
          <button
            key={service.id}
            type="button"
            onClick={() => setActive(index)}
            aria-label={t(`items.${service.id}.title`)}
            aria-current={index === active}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              index === active ? 'w-6 bg-ink' : 'w-1.5 bg-line-strong hover:bg-ink-subtle',
            )}
          />
        ))}
      </div>
    </Section>
  )
}

function Cover({
  index,
  isActive,
  onSelect,
  title,
  description,
  cta,
  icon: Icon,
}: {
  index: number
  isActive: boolean
  onSelect: () => void
  title: string
  description: string
  cta: string
  icon: (typeof services)[number]['icon']
}) {
  const [from, to] = COVERS[index % COVERS.length]

  return (
    <article
      onClick={isActive ? undefined : onSelect}
      className={cn(
        'relative flex aspect-[3/4] flex-col overflow-hidden rounded-[10px_22px_22px_10px] p-6 text-white',
        'shadow-[0_30px_60px_-20px_rgba(20,6,31,0.45)] select-none',
        !isActive && 'cursor-pointer',
      )}
      style={{ background: `linear-gradient(150deg, ${from}, ${to})` }}
    >
      {/* Spine: a darker band and a highlight, so it reads as a bound cover. */}
      <span aria-hidden className="absolute inset-y-0 left-0 w-3 bg-black/25" />
      <span aria-hidden className="absolute inset-y-0 left-3 w-px bg-white/25" />
      {/* Soft sheen across the cover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_100%_0%,rgba(255,255,255,0.22),transparent_60%)]"
      />

      <div className="relative flex items-center justify-between pl-3">
        <span className="text-[0.75rem] font-semibold tracking-[0.12em] text-white/70">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-[0.6875rem] font-semibold tracking-[0.14em] text-white/60">
          TECHON
        </span>
      </div>

      <div className="relative mt-auto pl-3">
        <span className="flex size-12 items-center justify-center rounded-[14px] bg-white/15 backdrop-blur-sm">
          <Icon className="size-6" aria-hidden />
        </span>
        <h3 className="mt-5 text-[1.5rem] leading-[1.1] font-semibold tracking-[-0.025em] text-white">
          {title}
        </h3>
        <p className="mt-2 text-[0.875rem] leading-snug text-white/80">{description}</p>

        <Link
          href="/#contact"
          tabIndex={isActive ? 0 : -1}
          className={cn(
            'mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[0.8125rem] font-medium text-ink transition-opacity',
            isActive ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          {cta}
          <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  )
}

function ShelfButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-line-strong hover:bg-surface"
    >
      {children}
    </button>
  )
}
