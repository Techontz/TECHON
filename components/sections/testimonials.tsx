'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useState } from 'react'

import { Reveal } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/ui/section'
import { testimonials } from '@/data/testimonials'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

const AUTOPLAY_MS = 8000

export function Testimonials() {
  const t = useTranslations('testimonials')
  const prefersReducedMotion = useReducedMotion()

  const [index, setIndex] = useState(0)
  /** +1 forward, -1 back. Decides which side the quote enters and leaves from. */
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)

  const go = useCallback((next: number, dir: number) => {
    setDirection(dir)
    setIndex((next + testimonials.length) % testimonials.length)
  }, [])

  const next = useCallback(() => go(index + 1, 1), [go, index])
  const previous = useCallback(() => go(index - 1, -1), [go, index])

  // Autoplay stops on hover, on focus, and for reduced-motion users. A quote
  // that advances mid-sentence is worse than one that never moves.
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return

    const timer = window.setTimeout(next, AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [index, isPaused, next, prefersReducedMotion])

  const active = testimonials[index]
  const offset = prefersReducedMotion ? 0 : 24

  return (
    <Section id="testimonials" tone="subtle" divided>
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
        align="center"
      />

      <Reveal className="mt-14 sm:mt-16">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          className="mx-auto max-w-3xl"
        >
          {/* Fixed height stops the page reflowing as quote lengths change. */}
          <div className="relative min-h-[19rem] sm:min-h-[15rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.blockquote
                key={active.id}
                initial={{ opacity: 0, x: direction * offset }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -offset }}
                transition={{ duration: 0.35, ease }}
                className="card-surface absolute inset-0 flex flex-col rounded-[10px] p-7 sm:p-9"
              >
                <p className="text-[1.125rem] leading-[1.55] text-balance text-ink sm:text-[1.3125rem]">
                  “{t(`items.${active.id}.quote`)}”
                </p>

                <footer className="mt-auto flex items-center gap-3.5 pt-7">
                  <span
                    aria-hidden
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-[0.8125rem] font-semibold text-ink-muted"
                  >
                    {active.initials}
                  </span>

                  <span className="min-w-0">
                    <cite className="block text-[0.9375rem] font-medium text-ink not-italic">
                      {t(`items.${active.id}.name`)}
                    </cite>
                    <span className="block text-[0.8125rem] text-ink-subtle">
                      {t(`items.${active.id}.role`)} · {t(`items.${active.id}.company`)}
                    </span>
                  </span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Control onClick={previous} label={t('prev')}>
                <ArrowLeft className="size-4" aria-hidden />
              </Control>
              <Control onClick={next} label={t('next')}>
                <ArrowRight className="size-4" aria-hidden />
              </Control>
            </div>

            {/* The active dot widens rather than only changing colour, so
                position is readable without relying on contrast alone. */}
            <div className="flex items-center gap-1.5">
              {testimonials.map((item, dotIndex) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(dotIndex, dotIndex > index ? 1 : -1)}
                  aria-label={`${t('eyebrow')} ${dotIndex + 1}`}
                  aria-current={dotIndex === index}
                  className="group py-2"
                >
                  <span
                    className={cn(
                      'block h-1 rounded-full transition-all duration-300',
                      dotIndex === index
                        ? 'w-6 bg-ink'
                        : 'w-2.5 bg-line-strong group-hover:bg-ink-subtle',
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

function Control({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-[8px]',
        'border border-line bg-white text-ink-muted',
        'transition-colors duration-200 hover:border-line-strong hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}
