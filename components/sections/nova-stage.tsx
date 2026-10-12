'use client'

import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { Mic, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

import { NovaPhone } from '@/components/sections/nova-phone'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * NOVA on every screen at once: a laptop holding a live chat, a watch speaking,
 * and the handset taking a call — grouped the way a product launch stages a
 * family of devices, over soft concentric arcs.
 *
 * Every loop pauses while the stage is off screen, and reduced-motion visitors
 * get the finished conversation, still.
 */
export function NovaStage() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-10% 0px' })
  const reduced = Boolean(useReducedMotion())
  const live = inView && !reduced

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[1040px]">
      <Arcs />

      <div className="relative flex items-end justify-center pt-6 sm:pt-10">
        {/* Watch and phone join from tablet width; on a phone the laptop alone
            carries the conversation rather than having it covered. */}
        <motion.div
          className="relative z-20 -mr-3 mb-10 hidden w-[118px] shrink-0 md:block md:-mr-5 md:w-[140px]"
          animate={live ? { y: [0, -6, 0] } : undefined}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Watch live={live} />
        </motion.div>

        <div className="relative z-10 w-full max-w-[620px]">
          <Laptop live={live} reduced={reduced} />
        </div>

        <motion.div
          className="relative z-20 -ml-4 hidden w-[150px] shrink-0 md:-ml-6 md:block md:w-[190px]"
          animate={live ? { y: [0, -8, 0] } : undefined}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        >
          {/* The handset is authored at 300px wide; it is scaled as a whole
              inside a slot of the scaled size so its own animation keeps its
              proportions and the row still aligns on the baseline. */}
          <div className="relative h-[240px] md:h-[304px]">
            <div
              className="absolute bottom-0 left-0 origin-bottom-left scale-[0.5] md:scale-[0.633]"
              style={{ width: 300 }}
            >
              <NovaPhone />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/** Concentric arcs behind the devices, drawn rather than imaged. */
function Arcs() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1040 520"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%] w-full"
    >
      <defs>
        <linearGradient id="nova-arc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7B19BC" stopOpacity="0.16" />
          <stop offset="1" stopColor="#7B19BC" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[500, 400, 300, 200].map((r, i) => (
        <circle
          key={r}
          cx="520"
          cy="560"
          r={r}
          fill={i === 3 ? 'url(#nova-arc)' : 'none'}
          stroke="url(#nova-arc)"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  )
}

// ----------------------------------------------------------------- Laptop

type Line = { from: 'user' | 'nova'; key: string }

const SCRIPT: Line[] = [
  { from: 'user', key: 'chat1' },
  { from: 'nova', key: 'chat2' },
  { from: 'user', key: 'chat3' },
  { from: 'nova', key: 'chat4' },
]

function Laptop({ live, reduced }: { live: boolean; reduced: boolean }) {
  const t = useTranslations('nova.stage')
  // How many lines are on screen; NOVA "types" before each of its replies.
  const [shown, setShown] = useState(reduced ? SCRIPT.length : 0)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (!live) return
    const next = SCRIPT[shown]
    let timer: number

    if (!next) {
      timer = window.setTimeout(() => setShown(0), 3600)
    } else if (next.from === 'nova' && !typing) {
      timer = window.setTimeout(() => setTyping(true), 500)
    } else {
      timer = window.setTimeout(
        () => {
          setTyping(false)
          setShown((n) => n + 1)
        },
        next.from === 'nova' ? 1400 : 1100,
      )
    }
    return () => window.clearTimeout(timer)
  }, [live, shown, typing])

  return (
    <div className="relative">
      {/* Lid */}
      <div className="rounded-[18px] border border-line bg-white p-2 shadow-[0_30px_80px_-20px_rgba(60,20,90,0.25)] sm:rounded-[22px] sm:p-2.5">
        <div className="overflow-hidden rounded-[12px] bg-surface-2 sm:rounded-[14px]">
          <div className="flex items-center gap-1.5 border-b border-line bg-white px-3 py-2">
            <span className="size-2 rounded-full bg-[#FF5F57]" />
            <span className="size-2 rounded-full bg-[#FEBC2E]" />
            <span className="size-2 rounded-full bg-[#28C840]" />
            <span className="mx-auto h-3 w-32 rounded-full bg-surface sm:w-44" />
          </div>

          <div className="flex h-[230px] flex-col px-4 pt-4 pb-3 sm:h-[300px] sm:px-6">
            <div className="flex items-center gap-2.5">
              <NovaMark className="size-7" />
              <div>
                <p className="text-[0.8125rem] leading-none font-semibold text-ink">NOVA</p>
                <p className="mt-1 flex items-center gap-1 text-[0.6875rem] leading-none text-success">
                  <span className="size-1.5 rounded-full bg-success" /> {t('online')}
                </p>
              </div>
              {/* Voice activity: NOVA is mid-sentence. */}
              <div className="ml-auto flex items-center gap-2 rounded-full bg-brand-wash px-2.5 py-1">
                <span className="flex h-3 items-center gap-[2px]">
                  {[0.5, 1, 0.7, 0.9, 0.4].map((h, i) => (
                    <motion.span
                      key={i}
                      className="w-[2px] rounded-full bg-brand"
                      style={{ height: `${h * 100}%` }}
                      animate={live ? { scaleY: [0.4, 1, 0.5, 0.9, 0.4] } : undefined}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
                    />
                  ))}
                </span>
                <span className="text-[0.625rem] font-medium text-brand">{t('speaking')}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-1 flex-col justify-end gap-2 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_28px)]">
              <AnimatePresence initial={false}>
                {SCRIPT.slice(0, shown).map((line) => (
                  <motion.div
                    key={line.key}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className={cn(
                      'max-w-[78%] rounded-[16px] px-3 py-2 text-[0.75rem] leading-snug sm:text-[0.8125rem]',
                      line.from === 'user'
                        ? 'self-end rounded-br-[6px] bg-brand text-white'
                        : 'self-start rounded-bl-[6px] bg-white text-ink shadow-xs',
                    )}
                  >
                    {t(line.key)}
                  </motion.div>
                ))}
                {typing ? (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-1 self-start rounded-[16px] rounded-bl-[6px] bg-white px-3 py-2.5 shadow-xs"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-1.5 rounded-full bg-ink-subtle"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5">
              <span className="flex-1 text-[0.75rem] text-ink-subtle">{t('placeholder')}</span>
              <span className="flex size-6 items-center justify-center rounded-full bg-brand text-white">
                <Mic className="size-3" aria-hidden />
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Base */}
      <div className="mx-auto h-2.5 w-[108%] -translate-x-[3.7%] rounded-b-[14px] bg-gradient-to-b from-[#e8e8ed] to-[#d2d2d7]" />
    </div>
  )
}

// ------------------------------------------------------------------ Watch

function Watch({ live }: { live: boolean }) {
  const t = useTranslations('nova.stage')
  const bars = [0.35, 0.7, 0.5, 1, 0.6, 0.85, 0.4, 0.75, 0.55]

  return (
    <div className="relative">
      <div className="mx-auto h-8 w-[62%] rounded-t-[14px] bg-[#e8e8ed]" />
      <div className="relative rounded-[30px] border border-line bg-white p-1.5 shadow-[0_20px_50px_-15px_rgba(60,20,90,0.3)]">
        <span className="absolute top-8 -right-1 h-6 w-1.5 rounded-full bg-line-strong" />
        <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-[24px] bg-ink px-2 text-center">
          <motion.div
            className="relative flex size-9 items-center justify-center rounded-full bg-brand"
            animate={live ? { scale: [1, 1.08, 1] } : undefined}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {live ? (
              <motion.span
                className="absolute inset-0 rounded-full border border-brand-soft"
                animate={{ scale: [1, 1.7], opacity: [0.7, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              />
            ) : null}
            <Sparkles className="size-4 text-white" aria-hidden />
          </motion.div>
          <div className="mt-2.5 flex h-5 items-center gap-[3px]">
            {bars.map((h, i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-brand-soft"
                style={{ height: `${h * 100}%` }}
                animate={live ? { scaleY: [0.4, 1, 0.5, 0.9, 0.4] } : undefined}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
              />
            ))}
          </div>
          <p className="mt-2 text-[0.625rem] leading-tight text-white/80">{t('speaking')}</p>
        </div>
      </div>
      <div className="mx-auto h-8 w-[62%] rounded-b-[14px] bg-[#e8e8ed]" />
    </div>
  )
}

/** NOVA's own mark: a sparkle on the brand disc. */
export function NovaMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-brand-accent to-brand-deep text-white',
        className,
      )}
    >
      <Sparkles className="size-[55%]" aria-hidden />
    </span>
  )
}
