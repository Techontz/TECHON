'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { officeAddressLines, onlineProvider } from '@/data/booking-options'
import { fromDateKey } from '@/lib/slots'
import { formatPrice, getConsultation } from '@/data/consultations'
import type { BookingDraft } from '@/lib/booking'
import { cn } from '@/lib/utils'

export interface SummaryItem {
  key: string
  label: string
  value: string
}

/**
 * Turns a draft into display rows.
 *
 * Shared by the review step and the confirmation screen so the two can never
 * disagree about what was booked — the single most confusing bug a booking
 * flow can have.
 */
export function useSummaryItems(draft: BookingDraft): SummaryItem[] {
  const t = useTranslations('booking.summary')
  const consultationCopy = useTranslations('booking.consultations')
  const meeting = useTranslations('booking.meeting')
  const common = useTranslations('booking')
  const locale = useLocale()

  return useMemo(() => {
    const consultation = getConsultation(draft.consultationId)
    const price = consultation ? formatPrice(consultation, locale) : null

    const dateLabel = draft.date
      ? new Intl.DateTimeFormat(locale, {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(fromDateKey(draft.date))
      : '—'

    const location =
      draft.meeting === 'office'
        ? officeAddressLines.slice(0, 4).join(', ')
        : draft.meeting === 'online'
          ? onlineProvider
          : '—'

    return [
      {
        key: 'consultation',
        label: t('consultation'),
        value: consultation ? consultationCopy(`${consultation.id}.title`) : '—',
      },
      {
        key: 'price',
        label: t('price'),
        value: price ?? common('free'),
      },
      {
        key: 'duration',
        label: t('duration'),
        value: consultation ? common('minutes', { count: consultation.durationMinutes }) : '—',
      },
      {
        key: 'meeting',
        label: t('meetingType'),
        value: draft.meeting ? meeting(`${draft.meeting}.title`) : '—',
      },
      { key: 'date', label: t('date'), value: dateLabel },
      { key: 'time', label: t('time'), value: draft.time ?? '—' },
      { key: 'location', label: t('location'), value: location },
      { key: 'email', label: t('email'), value: draft.email || '—' },
      { key: 'phone', label: t('phone'), value: draft.phone || '—' },
    ]
  }, [draft, locale, t, consultationCopy, meeting, common])
}

interface BookingSummaryProps {
  draft: BookingDraft
  className?: string
  /** Renders a compact variant for the confirmation screen. */
  tone?: 'card' | 'plain'
}

export function BookingSummary({ draft, className, tone = 'card' }: BookingSummaryProps) {
  const t = useTranslations('booking.summary')
  const items = useSummaryItems(draft)

  return (
    <div
      className={cn(
        tone === 'card' && 'rounded-[10px] border border-line bg-white',
        className,
      )}
    >
      {tone === 'card' ? (
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <h3 className="text-[0.9375rem] font-semibold text-ink">{t('title')}</h3>
        </div>
      ) : null}

      <dl className={cn(tone === 'card' && 'px-5 py-2 sm:px-6')}>
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-baseline justify-between gap-6 border-b border-line py-3.5 last:border-b-0"
          >
            <dt className="shrink-0 text-[0.8125rem] text-ink-muted">{item.label}</dt>
            <dd className="min-w-0 text-right text-[0.875rem] font-medium break-words text-ink">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
