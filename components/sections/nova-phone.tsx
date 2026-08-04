'use client'

import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { Mic, Phone, PhoneOff, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

import { PhoneFrame } from '@/components/ui/device-frame'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * NOVA's product visual: a handset cycling through three moments of a real
 * conversation — an incoming call, the live call, and the chat that follows.
 *
 * Constraints this component holds itself to:
 *   · Only the phone animates. Nothing outside its frame moves.
 *   · The loop is suspended whenever the phone is off screen, so it costs
 *     nothing while the visitor is reading anything else on the page.
 *   · Reduced-motion users get the final chat state, still and complete.
 *   · Transforms and opacity only — every frame stays on the compositor.
 */

type Scene = 'incoming' | 'call' | 'chat'

/** Scene order and dwell time. Long enough to read, short enough to hold. */
const SCENES: Array<{ id: Scene; ms: number }> = [
  { id: 'incoming', ms: 3200 },
  { id: 'call', ms: 5200 },
  { id: 'chat', ms: 6400 },
]

export function NovaPhone({ className }: { className?: string }) {
  const t = useTranslations('nova')
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { margin: '-10% 0px' })
  const prefersReducedMotion = useReducedMotion()

  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion || !isInView) return

    const timer = window.setTimeout(
      () => setIndex((current) => (current + 1) % SCENES.length),
      SCENES[index].ms,
    )
    return () => window.clearTimeout(timer)
  }, [index, isInView, prefersReducedMotion])

  // Reduced motion settles on the chat: the most informative of the three.
  const scene: Scene = prefersReducedMotion ? 'chat' : SCENES[index].id

  return (
    <div ref={containerRef} className={cn('relative mx-auto w-full max-w-[300px]', className)}>
      {!prefersReducedMotion ? <Particles active={isInView} /> : null}

      <PhoneFrame className="relative">
        <div className="flex h-[452px] flex-col">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-9 pb-2">
            <span className="text-[0.625rem] font-medium text-ink-subtle tabular-nums">09:41</span>
            <span className="flex items-center gap-1">
              <span className="size-1 rounded-full bg-brand" aria-hidden />
              <span className="text-[0.625rem] font-medium text-brand">NOVA</span>
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={scene}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease }}
              className="flex min-h-0 flex-1 flex-col"
            >
              {scene === 'incoming' ? <IncomingScene label={t('scene.incoming')} /> : null}
              {scene === 'call' ? (
                <CallScene listening={t('scene.listening')} answering={t('scene.answering')} />
              ) : null}
              {scene === 'chat' ? (
                <ChatScene thinking={t('scene.thinking')} still={!!prefersReducedMotion} />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </PhoneFrame>
    </div>
  )
}

/* ------------------------------------------------------------------ Scene 1 */

function IncomingScene({ label }: { label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-between px-6 pt-8 pb-8">
      <div className="flex flex-col items-center">
        <p className="text-[0.75rem] text-ink-subtle">{label}</p>
        <p className="mt-1 text-[1.0625rem] font-semibold text-ink">+255 769 190 100</p>
      </div>

      {/* Avatar with rings expanding outward — the ringing signal. */}
      <div className="relative flex size-28 items-center justify-center">
        {[0, 0.6, 1.2].map((delay) => (
          <motion.span
            key={delay}
            aria-hidden
            className="absolute inset-0 rounded-full border border-brand"
            initial={{ scale: 0.6, opacity: 0.5 }}
            animate={{ scale: 1.35, opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut', repeat: Infinity, delay }}
          />
        ))}

        <span className="relative flex size-16 items-center justify-center rounded-full bg-brand">
          <Sparkles className="size-6 text-white" aria-hidden />
        </span>
      </div>

      <div className="flex w-full items-center justify-center gap-10">
        {/* Decline stays neutral; accept carries the only colour, so the eye
            goes to the action NOVA is about to take. */}
        <span className="flex size-12 items-center justify-center rounded-full border border-line bg-white">
          <PhoneOff className="size-4 text-ink-subtle" aria-hidden />
        </span>

        <motion.span
          className="flex size-12 items-center justify-center rounded-full bg-brand"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity }}
        >
          <Phone className="size-4 text-white" aria-hidden />
        </motion.span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ Scene 2 */

function CallScene({ listening, answering }: { listening: string; answering: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-between px-6 pt-6 pb-8">
      <div className="flex flex-col items-center">
        <p className="text-[0.75rem] text-ink-subtle">{answering}</p>
        <p className="mt-1 font-mono text-[0.8125rem] text-ink tabular-nums">00:12</p>
      </div>

      {/* Listening ring: a soft halo that breathes while NOVA has the mic open. */}
      <div className="relative flex size-32 items-center justify-center">
        <motion.span
          aria-hidden
          className="absolute inset-2 rounded-full bg-brand-wash"
          animate={{ scale: [1, 1.12, 1], opacity: [0.7, 0.35, 0.7] }}
          transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.span
          aria-hidden
          className="absolute inset-5 rounded-full border border-brand/35"
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, delay: 0.3 }}
        />

        <span className="relative flex size-14 items-center justify-center rounded-full bg-brand">
          <Mic className="size-5 text-white" aria-hidden />
        </span>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <Equalizer />
        <p className="text-[0.75rem] text-ink-subtle">{listening}</p>
      </div>
    </div>
  )
}

/** Deterministic bar heights — random values would differ between server and client. */
const BARS = [0.35, 0.6, 0.9, 0.5, 0.75, 1, 0.55, 0.85, 0.4, 0.7, 0.95, 0.45]

function Equalizer() {
  return (
    <div className="flex h-9 items-center justify-center gap-[3px]" aria-hidden>
      {BARS.map((peak, index) => (
        <motion.span
          key={index}
          className="w-[3px] rounded-full bg-brand"
          style={{ height: '100%', transformOrigin: 'center' }}
          initial={{ scaleY: 0.18 }}
          animate={{ scaleY: [0.18, peak, 0.28, peak * 0.8, 0.18] }}
          transition={{
            duration: 1.1 + (index % 4) * 0.18,
            ease: 'easeInOut',
            repeat: Infinity,
            // Offsetting each bar is what reads as speech rather than a metronome.
            delay: index * 0.06,
          }}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ Scene 3 */

function ChatScene({ thinking, still }: { thinking: string; still: boolean }) {
  /** Message shapes rather than lettered text: nothing to translate or misread. */
  const bubbles = [
    { from: 'them', widths: ['100%', '78%'] },
    { from: 'nova', widths: ['100%', '92%', '64%'] },
    { from: 'them', widths: ['84%'] },
  ] as const

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-2.5 overflow-hidden bg-surface px-4 py-4">
        {bubbles.map((bubble, index) => (
          <motion.div
            key={index}
            initial={still ? false : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.36, ease, delay: still ? 0 : 0.15 + index * 0.55 }}
            className={cn(
              'max-w-[80%] space-y-1.5 rounded-[10px] p-2.5',
              bubble.from === 'nova'
                ? 'ml-auto rounded-tr-[4px] bg-brand'
                : 'rounded-tl-[4px] border border-line bg-white',
            )}
          >
            {bubble.widths.map((width, line) => (
              <span
                key={line}
                className={cn(
                  'block h-1.5 rounded-full',
                  bubble.from === 'nova' ? 'bg-white/55' : 'bg-line-strong',
                )}
                style={{ width }}
              />
            ))}
          </motion.div>
        ))}

        {/* Typing indicator, then the thinking state — the two signals that
            make an assistant feel present rather than instantaneous. */}
        {!still ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease, delay: 1.9 }}
              className="flex w-14 items-center justify-center gap-1 rounded-[10px] rounded-tr-[4px] bg-brand py-2.5 ml-auto"
            >
              {[0, 0.16, 0.32].map((delay) => (
                <motion.span
                  key={delay}
                  className="size-1.5 rounded-full bg-white/80"
                  animate={{ y: [0, -3, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.9, ease: 'easeInOut', repeat: Infinity, delay }}
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease, delay: 2.6 }}
              className="flex items-center gap-2 self-start"
            >
              <motion.span
                className="flex size-4 items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2.4, ease: 'linear', repeat: Infinity }}
              >
                <Sparkles className="size-3.5 text-brand" aria-hidden />
              </motion.span>
              <span className="text-[0.6875rem] text-ink-subtle">{thinking}</span>
            </motion.div>
          </>
        ) : null}
      </div>

      {/* Composer */}
      <div className="flex items-center gap-2 border-t border-line bg-white px-4 py-3">
        <span className="h-8 flex-1 rounded-full bg-surface" aria-hidden />
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand">
          <Mic className="size-3.5 text-white" aria-hidden />
        </span>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Particles */

/**
 * Eight motes drifting around the handset.
 *
 * Positions are fixed rather than random so server and client render the same
 * markup, and the whole field is clipped to the phone's own box — nothing
 * floats out over the section.
 */
const PARTICLES = [
  { left: '-6%', top: '14%', size: 4, duration: 7, delay: 0 },
  { left: '-10%', top: '52%', size: 3, duration: 9, delay: 1.4 },
  { left: '-4%', top: '78%', size: 5, duration: 8, delay: 0.6 },
  { left: '96%', top: '10%', size: 3, duration: 8.5, delay: 0.9 },
  { left: '102%', top: '38%', size: 5, duration: 7.5, delay: 2 },
  { left: '97%', top: '66%', size: 4, duration: 9.5, delay: 0.3 },
  { left: '18%', top: '-4%', size: 3, duration: 8, delay: 1.8 },
  { left: '74%', top: '99%', size: 4, duration: 7.8, delay: 1.1 },
]

function Particles({ active }: { active: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-[-8%]">
      {PARTICLES.map((particle, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-brand"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ opacity: 0 }}
          animate={
            active
              ? { opacity: [0, 0.35, 0], y: [0, -22, 0], scale: [0.8, 1, 0.8] }
              : { opacity: 0 }
          }
          transition={{
            duration: particle.duration,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  )
}
