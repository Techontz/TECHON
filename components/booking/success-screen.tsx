'use client'

import { motion } from 'framer-motion'
import { CalendarPlus, Check, Copy, Video } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { BookingSummary } from '@/components/booking/booking-summary'
import { ActionLink } from '@/components/ui/action-link'
import { officeAddressLines, onlineProvider } from '@/data/booking-options'
import { getConsultation } from '@/data/consultations'
import {
  buildIcs,
  downloadIcs,
  googleCalendarUrl,
  outlookCalendarUrl,
  toEndDate,
  toStartDate,
  type CalendarEvent,
  type ConfirmedBooking,
} from '@/lib/booking'
import { ease } from '@/lib/motion'
import { site, telLink } from '@/lib/site'
import { cn } from '@/lib/utils'

/**
 * Confirmation.
 *
 * The calendar buttons are real: Google and Outlook get proper deep links, and
 * Apple gets an RFC 5545 `.ics` download, since it has no web endpoint. None
 * of that needs a backend, so there was no reason to stub it.
 */
export function SuccessScreen({ booking }: { booking: ConfirmedBooking }) {
  const t = useTranslations('booking.success')
  const common = useTranslations('booking')
  const [copied, setCopied] = useState(false)

  const { draft, reference } = booking
  const consultation = getConsultation(draft.consultationId)
  const start = toStartDate(draft)

  const event: CalendarEvent | null =
    start && consultation
      ? {
          title: `${site.name} — ${t('eventTitle')}`,
          description: `${t('eventDescription')}\n\n${t('reference')}: ${reference}`,
          location:
            draft.meeting === 'office'
              ? officeAddressLines.join(', ')
              : (booking.meetingUrl ?? onlineProvider),
          start,
          end: toEndDate(start, consultation.durationMinutes),
        }
      : null

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(reference)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access is denied in some embedded and insecure contexts.
      // The reference is on screen regardless, so failing silently is right.
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="mx-auto max-w-2xl"
    >
      <div className="text-center">
        {/* The one moment of celebration on the site: a single ring settling
            around a tick. Nothing loops. */}
        <div className="relative mx-auto flex size-20 items-center justify-center">
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full border border-brand"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          />
          <motion.span
            className="flex size-14 items-center justify-center rounded-full bg-brand"
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.45, ease, delay: 0.15 }}
          >
            <Check className="size-7 text-white" aria-hidden />
          </motion.span>
        </div>

        <h1 className="type-h2 mt-8 text-balance">{t('title')}</h1>
        <p className="type-lead mx-auto mt-4 max-w-lg">{t('lead')}</p>

        {/* Reference */}
        <div className="mt-8 inline-flex items-center gap-3 rounded-[10px] border border-line bg-white px-4 py-3">
          <span className="text-[0.75rem] font-semibold tracking-wide text-ink-subtle uppercase">
            {t('reference')}
          </span>
          <span className="font-mono text-[0.9375rem] font-semibold text-ink">{reference}</span>
          <button
            type="button"
            onClick={copyReference}
            aria-label={t('copyReference')}
            className="rounded-[6px] p-1 text-ink-subtle transition-colors hover:bg-surface hover:text-ink"
          >
            {copied ? (
              <Check className="size-4 text-success" aria-hidden />
            ) : (
              <Copy className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <BookingSummary draft={draft} className="mt-10" />

      {/* Meeting link */}
      {draft.meeting === 'online' ? (
        <div className="mt-4 rounded-[10px] border border-line bg-white p-5">
          <p className="flex items-center gap-2 text-[0.75rem] font-semibold tracking-wide text-ink-subtle uppercase">
            <Video className="size-3.5" aria-hidden />
            {t('meetingLink')}
          </p>
          <p className="mt-2 font-mono text-[0.875rem] break-all text-ink">
            {booking.meetingUrl ?? t('linkPending')}
          </p>
          <p className="type-small mt-2 text-[0.8125rem]">{t('linkNote')}</p>
        </div>
      ) : null}

      {/* Calendar */}
      {event ? (
        <div className="mt-4 rounded-[10px] border border-line bg-white p-5">
          <p className="flex items-center gap-2 text-[0.75rem] font-semibold tracking-wide text-ink-subtle uppercase">
            <CalendarPlus className="size-3.5" aria-hidden />
            {t('addToCalendar')}
          </p>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <CalendarButton href={googleCalendarUrl(event)}>{t('google')}</CalendarButton>
            <CalendarButton href={outlookCalendarUrl(event)}>{t('outlook')}</CalendarButton>
            <CalendarButton
              onClick={() => downloadIcs(buildIcs(event, reference), `techon-${reference}.ics`)}
            >
              {t('apple')}
            </CalendarButton>
          </div>
        </div>
      ) : null}

      {/* Contact */}
      <div className="mt-4 rounded-[10px] border border-line bg-surface p-5 text-center">
        <p className="type-small text-[0.875rem]">{t('questions')}</p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.875rem]">
          <a
            href={`mailto:${site.contact.email}`}
            className="font-medium text-ink transition-colors hover:text-brand"
          >
            {site.contact.email}
          </a>
          {site.contact.phones.map((phone) => (
            <span key={phone.e164} className="flex items-center gap-3">
              <span aria-hidden className="text-ink-subtle">
                ·
              </span>
              <a
                href={telLink(phone.e164)}
                className="font-medium text-ink transition-colors hover:text-brand"
              >
                {phone.display}
              </a>
            </span>
          ))}
        </p>
      </div>

      <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <ActionLink href="/" variant="secondary">
          {common('backHome')}
        </ActionLink>
        <ActionLink href="/portfolio" variant="secondary">
          {common('seeWork')}
        </ActionLink>
      </div>
    </motion.div>
  )
}

const calendarButtonClass = cn(
  'inline-flex h-11 items-center justify-center rounded-[8px] border border-line bg-white',
  'text-[0.875rem] font-medium text-ink transition-colors duration-200',
  'hover:border-line-strong hover:bg-surface',
)

function CalendarButton({
  href,
  onClick,
  children,
}: {
  href?: string
  onClick?: () => void
  children: React.ReactNode
}) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={calendarButtonClass}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={calendarButtonClass}>
      {children}
    </button>
  )
}
