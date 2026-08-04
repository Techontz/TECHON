'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

import { getMonthAvailability } from '@/repositories/availability'
import { addDays, startOfToday, toDateKey } from '@/lib/slots'
import {
  DEFAULT_AVAILABILITY,
  type AvailabilityMap,
  type DayLoad,
  type SlotAvailability,
} from '@/models/availability'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface BookingCalendarProps {
  value: string | null
  /** Receives the day's full slot breakdown, so the time selector needs no second fetch. */
  onSelect: (day: SlotAvailability) => void
  /** Length of the appointment being booked; changes which slots can start. */
  durationMinutes?: number
}

/** Weeks start on Monday — a business calendar, not a wall calendar. */
const WEEK_START = 1

/**
 * Month calendar.
 *
 * A day is clickable unless it is closed, outside the booking window, or has
 * no slots left at all. Partially booked days stay open — the dot shows how
 * full they are, and the slot list shows exactly what remains.
 */
export function BookingCalendar({ value, onSelect, durationMinutes }: BookingCalendarProps) {
  const t = useTranslations('booking.calendar')
  const locale = useLocale()

  // Instantiated lazily: this only mounts after a consultation is chosen, so
  // it never renders on the server and cannot mismatch on hydration.
  const [month, setMonth] = useState(() => {
    const today = startOfToday()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })

  /**
   * Availability is stored with the month and duration it was fetched for, so
   * "loading" is derived rather than held in a second state that would have to
   * be set synchronously inside an effect.
   */
  const [loaded, setLoaded] = useState<{ key: string; map: AvailabilityMap } | null>(null)

  const requestKey = `${month.getFullYear()}-${month.getMonth()}-${durationMinutes ?? 0}`
  const isLoading = loaded?.key !== requestKey
  const availability: AvailabilityMap = isLoading ? {} : loaded.map

  useEffect(() => {
    let active = true
    const [year, monthIndex] = requestKey.split('-').map(Number)

    getMonthAvailability(year, monthIndex, durationMinutes).then((map) => {
      // Guards against a slow response for a month the visitor already left.
      if (active) setLoaded({ key: requestKey, map })
    })

    return () => {
      active = false
    }
  }, [requestKey, durationMinutes])

  const { firstMonth, lastMonth } = useMemo(() => {
    const today = startOfToday()
    const last = addDays(today, DEFAULT_AVAILABILITY.bookingWindowDays)
    return {
      firstMonth: new Date(today.getFullYear(), today.getMonth(), 1),
      lastMonth: new Date(last.getFullYear(), last.getMonth(), 1),
    }
  }, [])

  const canGoBack = month > firstMonth
  const canGoForward = month < lastMonth

  /** Leading blanks + every day of the month, aligned to a Monday start. */
  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1)
    const offset = (first.getDay() - WEEK_START + 7) % 7
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()

    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from(
        { length: daysInMonth },
        (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1),
      ),
    ]
  }, [month])

  const weekdayLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' })
    // 2024-01-01 was a Monday, so this walks Mon→Sun in the active locale.
    return Array.from({ length: 7 }, (_, index) => formatter.format(new Date(2024, 0, 1 + index)))
  }, [locale])

  const monthLabel = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month),
    [locale, month],
  )

  const todayKey = toDateKey(startOfToday())

  return (
    <div className="rounded-[10px] border border-line bg-white">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
        <NavButton
          label={t('previousMonth')}
          disabled={!canGoBack}
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </NavButton>

        <p aria-live="polite" className="text-[0.9375rem] font-semibold text-ink">
          {monthLabel}
        </p>

        <NavButton
          label={t('nextMonth')}
          disabled={!canGoForward}
          onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
        >
          <ChevronRight className="size-4" aria-hidden />
        </NavButton>
      </div>

      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-7 gap-1">
          {weekdayLabels.map((label) => (
            <div
              key={label}
              aria-hidden
              className="pb-2 text-center text-[0.6875rem] font-medium text-ink-subtle"
            >
              {label}
            </div>
          ))}

          {cells.map((date, index) => {
            if (!date) return <div key={`blank-${index}`} aria-hidden />

            const key = toDateKey(date)
            const day = availability[key]

            // Open unless closed, out of window, or genuinely out of slots.
            const isSelectable = Boolean(day && day.availableCount > 0)
            const isSelected = value === key

            return (
              <button
                key={key}
                type="button"
                disabled={!isSelectable || isLoading}
                onClick={() => day && onSelect(day)}
                aria-pressed={isSelected}
                aria-label={dayLabel(date, locale, day, t)}
                className={cn(
                  'relative flex aspect-square flex-col items-center justify-center rounded-[8px]',
                  'text-[0.875rem] font-medium transition-colors duration-150',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                  isSelected && 'bg-brand text-white',
                  !isSelected && isSelectable && 'text-ink hover:bg-surface',
                  !isSelectable && 'cursor-not-allowed text-ink-subtle/45',
                  // Only a day with nothing left is struck through.
                  day?.status === 'fullyBooked' && !isSelected && 'bg-surface line-through',
                )}
              >
                <span>{date.getDate()}</span>

                {/* Load dot: green plenty, orange filling, red full. */}
                {day && day.totalCount > 0 && !isSelected ? (
                  <span
                    aria-hidden
                    className={cn('mt-0.5 size-1.5 rounded-full', LOAD_DOT[day.load])}
                  />
                ) : null}

                {key === todayKey && !isSelected ? (
                  <span aria-hidden className="absolute inset-x-0 bottom-0.5 mx-auto h-px w-3 bg-ink-subtle" />
                ) : null}
              </button>
            )
          })}
        </div>

        {isLoading ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease }}
            className="pt-3 text-center text-[0.8125rem] text-ink-subtle"
          >
            {t('loading')}
          </motion.p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line px-4 py-3 sm:px-5">
        <Legend dot={LOAD_DOT.open} label={t('legendOpen')} />
        <Legend dot={LOAD_DOT.filling} label={t('legendFilling')} />
        <Legend dot={LOAD_DOT.full} label={t('legendFull')} />
      </div>
    </div>
  )
}

/**
 * Availability, encoded as a density of the brand hue rather than as a
 * traffic light.
 *
 * Colour is never the only signal: a full day is also struck through, the
 * legend names each state, and every cell's accessible name carries the count
 * of remaining slots — so the scale reads without relying on hue at all.
 */
const LOAD_DOT: Record<DayLoad, string> = {
  open: 'bg-brand',
  filling: 'bg-brand-soft',
  full: 'bg-line-strong',
}

function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-[8px] text-ink-muted',
        'transition-colors duration-200 hover:bg-surface hover:text-ink',
        'disabled:pointer-events-none disabled:opacity-30',
      )}
    >
      {children}
    </button>
  )
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden className={cn('size-1.5 rounded-full', dot)} />
      <span className="text-[0.75rem] text-ink-subtle">{label}</span>
    </span>
  )
}

/** Full date plus how many slots remain, so the dot is not the only signal. */
function dayLabel(
  date: Date,
  locale: string,
  day: SlotAvailability | undefined,
  t: (key: string, values?: Record<string, string | number>) => string,
): string {
  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)

  if (!day) return formatted
  if (day.status === 'closed') return `${formatted} — ${t('closed')}`
  if (day.availableCount === 0) return `${formatted} — ${t('legendFull')}`

  return `${formatted} — ${t('slotsLeft', { count: day.availableCount })}`
}
