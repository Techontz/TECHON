'use client'

import { Fragment } from 'react'
import { useTranslations } from 'next-intl'

import type { SlotAvailability } from '@/models/availability'
import { cn } from '@/lib/utils'

interface TimeSelectorProps {
  /** The engine's response for the chosen day. Null until a date is picked. */
  availability: SlotAvailability | null
  value: string | null
  onSelect: (time: string) => void
  loading?: boolean
}

/**
 * Time slots for the selected day.
 *
 * Renders directly from `SlotAvailability.slots` — every slot the day defines,
 * with taken ones greyed rather than omitted. Seeing that 10:00 exists and is
 * gone is more useful than seeing a shorter list, and it keeps the grid the
 * same shape from one day to the next.
 *
 * "Fully booked" appears only when `availableCount` is zero, which the engine
 * can only reach by every individual slot being unavailable.
 */
export function TimeSelector({ availability, value, onSelect, loading }: TimeSelectorProps) {
  const t = useTranslations('booking.time')

  if (loading) {
    return (
      <p className="rounded-[10px] border border-line px-5 py-8 text-center text-[0.875rem] text-ink-subtle">
        {t('loading')}
      </p>
    )
  }

  if (!availability) {
    return (
      <p className="rounded-[10px] border border-dashed border-line px-5 py-8 text-center text-[0.875rem] text-ink-subtle">
        {t('pickDateFirst')}
      </p>
    )
  }

  if (availability.status === 'closed') {
    return (
      <div className="rounded-[10px] border border-line bg-surface px-5 py-8 text-center">
        <p className="text-[0.9375rem] font-medium text-ink">{t('closed')}</p>
        <p className="type-small mt-1 text-[0.875rem]">{t('closedHint')}</p>
      </div>
    )
  }

  if (availability.availableCount === 0) {
    return (
      <div className="rounded-[10px] border border-line bg-surface px-5 py-8 text-center">
        <p className="text-[0.9375rem] font-medium text-ink">{t('fullyBooked')}</p>
        <p className="type-small mt-1 text-[0.875rem]">{t('fullyBookedHint')}</p>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-3 text-[0.8125rem] text-ink-subtle">
        {t('remaining', {
          available: availability.availableCount,
          total: availability.totalCount,
        })}
      </p>

      <div
        role="radiogroup"
        aria-label={t('label')}
        className="grid grid-cols-3 gap-2 sm:grid-cols-4"
      >
        {availability.slots.map((slot) => {
          const isSelected = value === slot.time

          return (
            <Fragment key={slot.time}>
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={!slot.available}
                onClick={() => onSelect(slot.time)}
                // Screen readers get the reason, which the strikethrough only
                // implies visually.
                aria-label={
                  slot.available ? slot.time : `${slot.time} — ${t(`reason.${slot.reason}`)}`
                }
                className={cn(
                  'h-12 rounded-[8px] border text-[0.9375rem] font-medium tabular-nums',
                  'transition-[background-color,border-color,color] duration-200',
                  isSelected && 'border-brand bg-brand text-white',
                  !isSelected &&
                    slot.available &&
                    'border-line bg-white text-ink hover:border-line-strong',
                  !slot.available &&
                    'cursor-not-allowed border-line bg-surface text-ink-subtle/45 line-through',
                )}
              >
                {slot.time}
              </button>

              {/* Lunch divider. Spans the row so the day reads as two blocks. */}
              {slot.breakAfter ? (
                <p
                  className="col-span-3 flex items-center gap-3 py-1 text-[0.75rem] text-ink-subtle sm:col-span-4"
                  aria-hidden
                >
                  <span className="h-px flex-1 bg-line" />
                  {t('lunchBreak')}
                  <span className="h-px flex-1 bg-line" />
                </p>
              ) : null}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
