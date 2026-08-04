'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'

import {
  meetingOptions,
  officeAddressLines,
  officeLocation,
  onlineProvider,
  type MeetingMode,
} from '@/data/booking-options'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface MeetingSelectorProps {
  value: MeetingMode | null
  onSelect: (mode: MeetingMode) => void
  name: string
}

export function MeetingSelector({ value, onSelect, name }: MeetingSelectorProps) {
  const t = useTranslations('booking.meeting')

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {meetingOptions.map((option) => {
          const Icon = option.icon
          const selected = value === option.id

          return (
            <label
              key={option.id}
              className={cn(
                'flex cursor-pointer items-start gap-3.5 rounded-[10px] border bg-white p-5',
                'transition-[border-color,box-shadow] duration-200',
                'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand',
                selected ? 'border-brand shadow-sm' : 'border-line hover:border-line-strong',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.id}
                checked={selected}
                onChange={() => onSelect(option.id)}
                className="sr-only"
              />

              <span
                className={cn(
                  'inline-flex size-9 shrink-0 items-center justify-center rounded-[8px] transition-colors duration-200',
                  selected ? 'bg-brand text-white' : 'bg-surface text-ink-muted',
                )}
              >
                <Icon className="size-4.5" aria-hidden />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[0.9375rem] font-medium text-ink">
                  {t(`${option.id}.title`)}
                </span>
                <span className="type-small mt-1 block text-[0.8125rem]">
                  {t(`${option.id}.description`)}
                </span>
              </span>

              <span
                aria-hidden
                className={cn(
                  'inline-flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
                  selected ? 'border-brand bg-brand' : 'border-line-strong bg-white',
                )}
              >
                {selected ? <Check className="size-3 text-white" /> : null}
              </span>
            </label>
          )
        })}
      </div>

      {/* Detail panel. Height is not animated — only opacity and a 6px slide —
          so the section below never jumps as the panel swaps. */}
      <AnimatePresence mode="wait" initial={false}>
        {value === 'office' ? (
          <motion.div
            key="office"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease }}
            className="mt-3 overflow-hidden rounded-[10px] border border-line bg-white"
          >
            <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="p-5">
                <p className="text-[0.75rem] font-semibold tracking-wide text-ink-subtle uppercase">
                  {t('officeLabel')}
                </p>
                <address className="mt-3 space-y-0.5 not-italic">
                  {officeAddressLines.map((line, index) => (
                    <span
                      key={line}
                      className={cn(
                        'block text-[0.9375rem]',
                        index === 0 ? 'font-medium text-ink' : 'text-ink-muted',
                      )}
                    >
                      {line}
                    </span>
                  ))}
                </address>

                <a
                  href={`https://maps.google.com/?q=${officeLocation.coordinates.lat},${officeLocation.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-brand hover:underline"
                >
                  <MapPin className="size-3.5" aria-hidden />
                  {t('directions')}
                </a>
              </div>

              {/* Map placeholder. Drop an embed or static tile in here — the box
                  is already the right size, so nothing shifts. */}
              <div
                aria-hidden
                className="relative min-h-[168px] border-t border-line bg-surface sm:border-t-0 sm:border-l"
              >
                <div className="bg-hairline-grid absolute inset-0 opacity-70" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-full bg-white shadow-xs">
                    <MapPin className="size-4 text-brand" />
                  </span>
                  <span className="text-[0.75rem] text-ink-subtle">{t('mapPlaceholder')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {value === 'online' ? (
          <motion.div
            key="online"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease }}
            className="mt-3 rounded-[10px] border border-line bg-white p-5"
          >
            <p className="text-[0.75rem] font-semibold tracking-wide text-ink-subtle uppercase">
              {t('onlineLabel')}
            </p>
            <p className="mt-3 text-[0.9375rem] font-medium text-ink">{onlineProvider}</p>
            <p className="type-small mt-1 text-[0.875rem]">{t('linkAfterConfirmation')}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
