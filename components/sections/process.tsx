import { useTranslations } from 'next-intl'

import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/ui/section'
import { processSteps } from '@/data/process'

/**
 * The seven delivery stages.
 *
 * A ruled list rather than a decorated timeline: numbers on the left, content
 * on the right, one hairline between each. The sequence is legible without a
 * connector line drawing attention to itself.
 */
export function Process() {
  const t = useTranslations('process')

  return (
    <Section id="process" tone="subtle" divided>
      <SectionHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

      <RevealGroup as="ol" className="mt-14 sm:mt-16" stagger={0.05}>
        {processSteps.map((step, index) => (
          <RevealItem key={step.id} as="li" className="border-t border-line last:border-b">
            <div className="grid gap-x-8 gap-y-2 py-7 sm:grid-cols-[3rem_minmax(0,14rem)_minmax(0,1fr)_auto] sm:items-baseline sm:py-8">
              <span className="text-[0.875rem] font-medium text-ink-subtle tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3 className="type-h3">{t(`steps.${step.id}.title`)}</h3>

              <p className="type-small max-w-2xl">{t(`steps.${step.id}.description`)}</p>

              <span className="text-[0.8125rem] text-ink-subtle sm:text-right">
                {step.duration}
              </span>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
