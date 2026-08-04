'use client'

import { Check, Clock } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { Tag } from '@/components/ui/tag'
import { formatPrice, type Consultation } from '@/data/consultations'
import { cn } from '@/lib/utils'

interface ConsultationCardProps {
  consultation: Consultation
  selected: boolean
  onSelect: () => void
  /** Shared across the group so arrow keys move between the three options. */
  name: string
}

/**
 * One selectable consultation.
 *
 * Built on a real `<input type="radio">` hidden under a `<label>`: the group
 * gets native arrow-key navigation, form semantics and screen-reader
 * announcements for free, which a div with `role="radio"` would all have to
 * reimplement.
 */
export function ConsultationCard({
  consultation,
  selected,
  onSelect,
  name,
}: ConsultationCardProps) {
  const t = useTranslations('booking.consultations')
  const common = useTranslations('booking')
  const locale = useLocale()

  const Icon = consultation.icon
  const price = formatPrice(consultation, locale)

  return (
    <label
      className={cn(
        'group relative flex h-full cursor-pointer flex-col rounded-[10px] border bg-white p-6',
        'transition-[border-color,box-shadow] duration-200',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand',
        selected ? 'border-brand shadow-sm' : 'border-line hover:border-line-strong',
      )}
    >
      <input
        type="radio"
        name={name}
        value={consultation.id}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />

      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'inline-flex size-10 items-center justify-center rounded-[8px] transition-colors duration-200',
            selected ? 'bg-brand text-white' : 'bg-surface text-ink-muted',
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>

        <span
          aria-hidden
          className={cn(
            'inline-flex size-5 items-center justify-center rounded-full border transition-all duration-200',
            selected ? 'border-brand bg-brand' : 'border-line-strong bg-white',
          )}
        >
          {selected ? <Check className="size-3 text-white" /> : null}
        </span>
      </div>

      <h3 className="type-h3 mt-5 text-[1.0625rem]">{t(`${consultation.id}.title`)}</h3>

      <p className="type-small mt-2 flex-1 text-[0.875rem]">
        {t(`${consultation.id}.description`)}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="flex items-center gap-1.5 text-[0.8125rem] text-ink-muted">
          <Clock className="size-3.5" aria-hidden />
          {common('minutes', { count: consultation.durationMinutes })}
        </span>

        {price ? (
          <span className="text-[0.9375rem] font-semibold text-ink tabular-nums">{price}</span>
        ) : (
          <Tag tone="brand">{common('free')}</Tag>
        )}
      </div>

      {consultation.recommended ? (
        <span className="absolute -top-2.5 left-6">
          <Tag tone="brand" className="bg-brand text-white">
            {common('recommended')}
          </Tag>
        </span>
      ) : null}
    </label>
  )
}
