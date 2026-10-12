'use client'

import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'framer-motion'
import {
  BarChart3,
  Bot,
  CreditCard,
  LayoutGrid,
  Package,
  PhoneCall,
  ShoppingBag,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * The hero's product shot: a live dashboard rather than a wireframe.
 *
 * Numbers count up, the revenue line draws itself, the sidebar highlight
 * glides between sections and an activity feed keeps arriving. Every loop is
 * suspended while the shot is off screen; reduced-motion visitors get the
 * finished dashboard, still. Decorative: the real content of the page is the
 * copy above it, so the whole illustration is hidden from assistive tech.
 */

const NAV = [
  { icon: LayoutGrid, label: 'Overview' },
  { icon: ShoppingBag, label: 'Orders' },
  { icon: Users, label: 'Customers' },
  { icon: Bot, label: 'NOVA AI' },
  { icon: CreditCard, label: 'Payments' },
  { icon: BarChart3, label: 'Reports' },
]

const FEED = [
  { icon: PhoneCall, tone: 'bg-brand-wash text-brand', title: 'NOVA answered a call', meta: 'Booked a demo for Friday' },
  { icon: Wallet, tone: 'bg-[#e6f6ec] text-success', title: 'Payment received', meta: 'TZS 150,000 · M-Pesa' },
  { icon: Package, tone: 'bg-[#fff3e0] text-[#c25e00]', title: 'New order', meta: 'Kariakoo · 3 items' },
  { icon: Sparkles, tone: 'bg-[#e7f0ff] text-[#1c64d6]', title: 'Release 2.4 shipped', meta: 'Android and iOS' },
  { icon: Users, tone: 'bg-brand-wash text-brand', title: 'New customer', meta: 'Signed up from Arusha' },
  { icon: Wallet, tone: 'bg-[#e6f6ec] text-success', title: 'Payment received', meta: 'TZS 82,500 · Airtel Money' },
]

/** Twelve weeks of revenue, as a smooth upward story. */
const SERIES = [22, 26, 24, 31, 29, 36, 34, 41, 39, 47, 52, 58]

export function ProductMockup({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-5% 0px' })
  const reduced = Boolean(useReducedMotion())
  const live = inView && !reduced

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn('flex bg-surface-2 text-left select-none', className)}
    >
      <Sidebar live={live} />

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.6875rem] text-ink-subtle sm:text-[0.75rem]">Overview</p>
            <p className="text-[0.875rem] font-semibold tracking-[-0.01em] text-ink sm:text-[1.0625rem]">
              Good morning, Amina
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[0.6875rem] font-medium text-success shadow-xs">
              <span className="relative flex size-1.5">
                {live ? (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                ) : null}
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
              Live
            </span>
            <span className="hidden size-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-accent to-brand-deep text-[0.625rem] font-semibold text-white sm:flex">
              AM
            </span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
          <Kpi label="Revenue · TZS" value={48.2} decimals={1} suffix="M" delta="+12.4%" live={live} reduced={reduced} delay={0.3} />
          <Kpi label="Orders" value={1284} delta="+8.1%" live={live} reduced={reduced} delay={0.45} />
          <Kpi label="Resolved by NOVA" value={94} suffix="%" delta="+3.2%" live={live} reduced={reduced} delay={0.6} className="hidden sm:block" />
        </div>

        {/* Chart + feed */}
        <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <RevenueChart live={live} reduced={reduced} />
          <Feed live={live} reduced={reduced} />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Sidebar

function Sidebar({ live }: { live: boolean }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!live) return
    const timer = window.setInterval(() => setActive((i) => (i + 1) % 4), 2600)
    return () => window.clearInterval(timer)
  }, [live])

  return (
    <div className="hidden w-[190px] shrink-0 flex-col border-r border-line bg-white p-4 md:flex">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-brand-accent to-brand-deep text-white">
          <Sparkles className="size-3.5" />
        </span>
        <span className="text-[0.8125rem] font-semibold tracking-[-0.01em] text-ink">Workspace</span>
      </div>

      <ul className="mt-6 space-y-1">
        {NAV.map((item, index) => {
          const Icon = item.icon
          const isActive = index === active
          return (
            <li key={item.label} className="relative">
              {isActive ? (
                <motion.span
                  layoutId="mockup-nav"
                  className="absolute inset-0 rounded-[8px] bg-brand-wash"
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              ) : null}
              <span
                className={cn(
                  'relative flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-[0.75rem] transition-colors duration-300',
                  isActive ? 'font-medium text-brand' : 'text-ink-muted',
                )}
              >
                <Icon className="size-3.5" />
                {item.label}
              </span>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto rounded-[12px] bg-surface p-3">
        <p className="text-[0.6875rem] font-medium text-ink">NOVA is on duty</p>
        <p className="mt-0.5 text-[0.625rem] text-ink-subtle">32 languages · 24/7</p>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------- KPIs

function Kpi({
  label,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  delta,
  live,
  reduced,
  delay,
  className,
}: {
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  delta: string
  live: boolean
  reduced: boolean
  delay: number
  className?: string
}) {
  const [shown, setShown] = useState(reduced ? value : 0)
  const started = useRef(false)

  useEffect(() => {
    if (!live || started.current) return
    started.current = true
    const controls = animate(0, value, {
      duration: 1.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setShown,
    })
    return () => controls.stop()
  }, [live, value, delay])

  const display = reduced ? value : shown
  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString('en-US')

  return (
    <div className={cn('rounded-[12px] border border-line bg-white p-3 sm:p-3.5', className)}>
      <p className="text-[0.625rem] text-ink-subtle sm:text-[0.6875rem]">{label}</p>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <p className="truncate text-[0.9375rem] font-semibold tracking-[-0.02em] text-ink tabular-nums sm:text-[1.25rem]">
          {prefix}
          {formatted}
          {suffix}
        </p>
        <span className="shrink-0 rounded-full bg-[#e6f6ec] px-1.5 py-0.5 text-[0.5625rem] font-semibold text-success sm:text-[0.625rem]">
          {delta}
        </span>
      </div>
      <Sparkline live={live} reduced={reduced} delay={delay + 0.2} />
    </div>
  )
}

function Sparkline({ live, reduced, delay }: { live: boolean; reduced: boolean; delay: number }) {
  const d = 'M0 18 C 10 16, 16 12, 24 13 S 40 6, 50 8 S 66 3, 80 2'
  return (
    <svg viewBox="0 0 80 20" className="mt-2 h-4 w-full" preserveAspectRatio="none">
      <motion.path
        d={d}
        fill="none"
        stroke="#7B19BC"
        strokeWidth="1.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={live || reduced ? { pathLength: 1 } : undefined}
        transition={{ duration: 1.4, delay, ease }}
      />
    </svg>
  )
}

// ------------------------------------------------------------------ Chart

function RevenueChart({ live, reduced }: { live: boolean; reduced: boolean }) {
  const w = 400
  const h = 150
  const max = 64
  const points = SERIES.map((v, i) => [(i / (SERIES.length - 1)) * w, h - (v / max) * h] as const)
  // Smooth the line with simple cubic segments between midpoints.
  const line = points.reduce((path, [x, y], i) => {
    if (i === 0) return `M${x} ${y}`
    const [px, py] = points[i - 1]
    const mx = (px + x) / 2
    return `${path} C ${mx} ${py}, ${mx} ${y}, ${x} ${y}`
  }, '')
  const area = `${line} L ${w} ${h} L 0 ${h} Z`
  const [lx, ly] = points[points.length - 1]

  return (
    <div className="flex min-h-0 flex-col rounded-[12px] border border-line bg-white p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <p className="text-[0.6875rem] font-medium text-ink sm:text-[0.75rem]">Revenue · last 12 weeks</p>
        <div className="flex gap-1">
          {['1M', '3M', '1Y'].map((range, i) => (
            <span
              key={range}
              className={cn(
                'rounded-full px-2 py-0.5 text-[0.5625rem] font-medium sm:text-[0.625rem]',
                i === 1 ? 'bg-ink text-white' : 'text-ink-subtle',
              )}
            >
              {range}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-2 min-h-0 flex-1">
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <linearGradient id="mockup-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7B19BC" stopOpacity="0.22" />
              <stop offset="1" stopColor="#7B19BC" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="#e8e8ed" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
          ))}
          <motion.path
            d={area}
            fill="url(#mockup-area)"
            initial={{ opacity: reduced ? 1 : 0 }}
            animate={live || reduced ? { opacity: 1 } : undefined}
            transition={{ duration: 1, delay: 1.4, ease }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke="#7B19BC"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={live || reduced ? { pathLength: 1 } : undefined}
            transition={{ duration: 2, delay: 0.5, ease }}
          />
        </svg>

        {/* End-of-line marker, positioned in % so it tracks the stretched SVG. */}
        <motion.span
          className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand shadow-[0_0_0_4px_rgba(123,25,188,0.18)]"
          style={{ left: `${(lx / w) * 100}%`, top: `${(ly / h) * 100}%` }}
          initial={{ scale: reduced ? 1 : 0 }}
          animate={live || reduced ? { scale: 1 } : undefined}
          transition={{ duration: 0.4, delay: 2.4, ease }}
        />
        <motion.span
          className="absolute -translate-x-[115%] translate-y-[35%] rounded-[6px] bg-ink px-1.5 py-0.5 text-[0.5625rem] font-semibold whitespace-nowrap text-white sm:text-[0.625rem]"
          style={{ left: `${(lx / w) * 100}%`, top: `${(ly / h) * 100}%` }}
          initial={{ opacity: reduced ? 1 : 0, y: 4 }}
          animate={live || reduced ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4, delay: 2.6, ease }}
        >
          TZS 5.8M
        </motion.span>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------- Feed

function Feed({ live, reduced }: { live: boolean; reduced: boolean }) {
  // `head` is the index of the newest event; the four most recent are shown.
  const [head, setHead] = useState(3)

  useEffect(() => {
    if (!live) return
    const timer = window.setInterval(() => setHead((h) => h + 1), 2400)
    return () => window.clearInterval(timer)
  }, [live])

  const items = [0, 1, 2, 3].map((offset) => {
    const n = head - offset
    return { n, ...FEED[((n % FEED.length) + FEED.length) % FEED.length] }
  })

  return (
    <div className="hidden min-h-0 flex-col overflow-hidden rounded-[12px] border border-line bg-white p-3 sm:flex sm:p-4">
      <p className="text-[0.75rem] font-medium text-ink">Activity</p>
      <ul className="mt-2 flex flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const Icon = item.icon
            return (
              <motion.li
                key={item.n}
                layout={!reduced}
                initial={{ opacity: 0, y: -14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.45, ease }}
                className="flex items-center gap-2.5 rounded-[10px] p-1.5"
              >
                <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full', item.tone)}>
                  <Icon className="size-3.5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[0.6875rem] font-medium text-ink">{item.title}</span>
                  <span className="block truncate text-[0.625rem] text-ink-subtle">{item.meta}</span>
                </span>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </div>
  )
}
