'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useId, useRef, useState } from 'react'

import { BookingCalendar } from '@/components/booking/booking-calendar'
import { BookingSummary } from '@/components/booking/booking-summary'
import { BudgetSelector } from '@/components/booking/budget-selector'
import { ConsultationCard } from '@/components/booking/consultation-card'
import { ContactForm } from '@/components/booking/contact-form'
import { MeetingSelector } from '@/components/booking/meeting-selector'
import { SuccessScreen } from '@/components/booking/success-screen'
import { TimeSelector } from '@/components/booking/time-selector'
import { ActionButton } from '@/components/ui/action-link'
import { Eyebrow } from '@/components/ui/section'
import type { MeetingMode } from '@/data/booking-options'
import type { SlotAvailability } from '@/models/availability'
import { consultations, type ConsultationId } from '@/data/consultations'
import {
  emptyDraft,
  isScheduleComplete,
  validateDetails,
  type BookingDraft,
  type ConfirmedBooking,
  type FieldErrors,
} from '@/lib/booking'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * The booking flow.
 *
 * The seven steps in the brief are grouped into four stages, because choosing
 * a date, a time and a meeting type is one decision made in one place — seven
 * separate screens would be seven clicks to book a fifteen-minute call.
 *
 * All state lives here; every child is presentational and receives a slice of
 * the draft plus a change handler. No component reaches into availability data
 * directly except the calendar, which owns the fetch because it owns the month.
 */

const STAGES = ['consultation', 'schedule', 'details', 'review'] as const
type Stage = (typeof STAGES)[number]

export function BookingFlow() {
  const t = useTranslations('booking')
  const groupName = useId()
  const topRef = useRef<HTMLDivElement>(null)

  const [stage, setStage] = useState<Stage>('consultation')
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft)
  const [selectedDay, setSelectedDay] = useState<SlotAvailability | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [booking, setBooking] = useState<ConfirmedBooking | null>(null)

  const stageIndex = STAGES.indexOf(stage)
  // Duration drives which start times can fit, so the calendar and the slot
  // list both need it.
  const selectedConsultation = consultations.find((item) => item.id === draft.consultationId)

  const patch = useCallback((changes: Partial<BookingDraft>) => {
    setDraft((current) => ({ ...current, ...changes }))
  }, [])

  /** Keeps the next stage's heading in view instead of mid-form. */
  const scrollToTop = useCallback(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  function goTo(next: Stage) {
    setStage(next)
    scrollToTop()
  }

  function handleDateSelect(day: SlotAvailability) {
    setSelectedDay(day)
    // A time only means something for the day it belongs to, so changing the
    // date must clear it — otherwise 14:00 could survive onto a day where
    // 14:00 is already taken.
    patch({ date: day.date, time: null })
  }

  function handleContinue() {
    if (stage === 'consultation') return goTo('schedule')
    if (stage === 'schedule') return goTo('details')

    if (stage === 'details') {
      const found = validateDetails(draft)
      setErrors(found)
      if (Object.keys(found).length > 0) return
      return goTo('review')
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    try {
      // Placeholder until the Firestore repository is wired into this flow —
      // see the note in the summary. The slot engine below is already live.
      const reference = `TO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
      setBooking({
        reference,
        draft,
        // Placeholder until a conferencing provider is connected; the success
        // screen already renders whatever this contains.
        meetingUrl:
          draft.meeting === 'online'
            ? `https://meet.google.com/${reference.toLowerCase().replace('to-', 'tec-')}-nova`
            : undefined,
      })
      scrollToTop()
    } finally {
      setIsSubmitting(false)
    }
  }

  const canContinue =
    (stage === 'consultation' && Boolean(draft.consultationId)) ||
    (stage === 'schedule' && isScheduleComplete(draft)) ||
    (stage === 'details' && true)

  if (booking) {
    return (
      <div ref={topRef} className="scroll-mt-24">
        <SuccessScreen booking={booking} />
      </div>
    )
  }

  return (
    <div ref={topRef} className="scroll-mt-24">
      <StageIndicator current={stageIndex} />

      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease }}
          className="mt-10 sm:mt-12"
        >
          {stage === 'consultation' ? (
            <section aria-labelledby="stage-consultation">
              <StageHeading id="stage-consultation" step={1} title={t('steps.consultation')} />

              <div
                role="radiogroup"
                aria-labelledby="stage-consultation"
                className="mt-8 grid gap-4 lg:grid-cols-3"
              >
                {consultations.map((consultation) => (
                  <ConsultationCard
                    key={consultation.id}
                    consultation={consultation}
                    name={`${groupName}-consultation`}
                    selected={draft.consultationId === consultation.id}
                    onSelect={() =>
                      patch({ consultationId: consultation.id as ConsultationId })
                    }
                  />
                ))}
              </div>

              {/* Fee credit — the single most reassuring thing on the page, so
                  it sits directly under the prices rather than in small print. */}
              <div className="mt-6 flex items-start gap-3.5 rounded-[10px] border border-line bg-brand-wash p-5">
                <Info className="mt-0.5 size-4.5 shrink-0 text-brand" aria-hidden />
                <p className="text-[0.9375rem] leading-relaxed text-ink">{t('feeCredit')}</p>
              </div>
            </section>
          ) : null}

          {stage === 'schedule' ? (
            <section aria-labelledby="stage-schedule" className="space-y-10">
              <div>
                <StageHeading id="stage-schedule" step={2} title={t('steps.date')} />
                <div className="mt-6">
                  <BookingCalendar
                    value={draft.date}
                    onSelect={handleDateSelect}
                    durationMinutes={selectedConsultation?.durationMinutes}
                  />
                </div>
              </div>

              <div>
                <StageHeading step={3} title={t('steps.time')} />
                <div className="mt-6">
                  <TimeSelector
                    availability={selectedDay}
                    value={draft.time}
                    onSelect={(slot) => patch({ time: slot })}
                  />
                </div>
              </div>

              <div>
                <StageHeading step={4} title={t('steps.meeting')} />
                <div className="mt-6">
                  <MeetingSelector
                    value={draft.meeting}
                    name={`${groupName}-meeting`}
                    onSelect={(mode: MeetingMode) => patch({ meeting: mode })}
                  />
                </div>
              </div>
            </section>
          ) : null}

          {stage === 'details' ? (
            <section aria-labelledby="stage-details" className="space-y-10">
              <div>
                <StageHeading id="stage-details" step={5} title={t('steps.personal')} />
                <div className="mt-6">
                  <ContactForm draft={draft} errors={errors} onChange={patch} />
                </div>
              </div>

              <div>
                <StageHeading step={6} title={t('steps.project')} />
                <div className="mt-6">
                  <BudgetSelector draft={draft} errors={errors} onChange={patch} />
                </div>
              </div>

              {Object.keys(errors).length > 0 ? (
                <p role="alert" className="text-[0.875rem] text-destructive">
                  {t('errors.summary')}
                </p>
              ) : null}
            </section>
          ) : null}

          {stage === 'review' ? (
            <section aria-labelledby="stage-review">
              <StageHeading id="stage-review" step={7} title={t('steps.review')} />

              <div className="mt-6">
                <BookingSummary draft={draft} />
              </div>

              {draft.description ? (
                <div className="mt-4 rounded-[10px] border border-line bg-white p-5">
                  <p className="text-[0.75rem] font-semibold tracking-wide text-ink-subtle uppercase">
                    {t('project.description')}
                  </p>
                  <p className="type-small mt-2 whitespace-pre-line">{draft.description}</p>
                </div>
              ) : null}

              <div className="mt-4 flex items-start gap-3.5 rounded-[10px] border border-line bg-brand-wash p-5">
                <Info className="mt-0.5 size-4.5 shrink-0 text-brand" aria-hidden />
                <p className="text-[0.875rem] leading-relaxed text-ink">{t('feeCredit')}</p>
              </div>
            </section>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-10 flex flex-col-reverse items-stretch gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        {stageIndex > 0 ? (
          <ActionButton
            variant="secondary"
            onClick={() => goTo(STAGES[stageIndex - 1])}
            disabled={isSubmitting}
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t('back')}
          </ActionButton>
        ) : (
          <span className="hidden sm:block" />
        )}

        {stage === 'review' ? (
          <ActionButton size="lg" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('submit')}
            {!isSubmitting ? <Check className="size-4" aria-hidden /> : null}
          </ActionButton>
        ) : (
          <ActionButton
            size="lg"
            onClick={handleContinue}
            disabled={!canContinue}
            icon={<ArrowRight className="size-4" aria-hidden />}
          >
            {t('continue')}
          </ActionButton>
        )}
      </div>

      {/* Explains a disabled Continue rather than leaving it inert and silent. */}
      {!canContinue && stage !== 'details' ? (
        <p className="mt-3 text-center text-[0.8125rem] text-ink-subtle sm:text-right">
          {stage === 'consultation' ? t('hints.consultation') : t('hints.schedule')}
        </p>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ Chrome */

function StageIndicator({ current }: { current: number }) {
  const t = useTranslations('booking.stages')

  return (
    <nav aria-label={t('label')}>
      {/* `minmax(0,1fr)` rather than plain `grid-cols-4`: a default grid track
          has a min-content floor, so a long stage name in German could force
          the track — and the page — wider than the viewport. */}
      <ol className="grid grid-cols-[repeat(4,minmax(0,1fr))] gap-2">
        {STAGES.map((id, index) => {
          const isDone = index < current
          const isCurrent = index === current

          return (
            <li key={id} className="flex min-w-0 flex-col gap-2">
              <span
                aria-hidden
                className={cn(
                  'h-0.5 rounded-full transition-colors duration-300',
                  isDone || isCurrent ? 'bg-brand' : 'bg-line',
                )}
              />
              <span
                className={cn(
                  'flex min-w-0 items-baseline text-[0.75rem] font-medium transition-colors duration-300',
                  isCurrent ? 'text-ink' : 'text-ink-subtle',
                )}
              >
                <span className="tabular-nums">{index + 1}</span>
                <span className="ml-1.5 hidden truncate sm:inline">{t(id)}</span>
                {isCurrent ? (
                  <span className="ml-1.5 truncate sm:hidden">{t(id)}</span>
                ) : null}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function StageHeading({ id, step, title }: { id?: string; step: number; title: string }) {
  const t = useTranslations('booking')

  return (
    <div>
      <Eyebrow>{t('stepLabel', { step })}</Eyebrow>
      <h2 id={id} className="type-h3 mt-2 text-[1.375rem] sm:text-[1.5rem]">
        {title}
      </h2>
    </div>
  )
}
