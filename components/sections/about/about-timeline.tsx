import { useTranslations } from 'next-intl'

import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/ui/section'
import { milestones } from '@/data/about'

/**
 * Company timeline.
 *
 * A ruled list keyed by year — the same structure as the delivery process
 * section, so the two read as the same kind of object rather than as two
 * different designers' work.
 */
export function AboutTimeline() {
  const t = useTranslations('about.timeline')

  return (
    <Section tone="subtle" divided>
      <SectionHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

      <RevealGroup as="ol" className="mt-14 sm:mt-16" stagger={0.05}>
        {milestones.map((milestone) => (
          <RevealItem key={milestone.id} as="li" className="border-t border-line last:border-b">
            <div className="grid gap-x-8 gap-y-2 py-7 sm:grid-cols-[5rem_minmax(0,16rem)_minmax(0,1fr)] sm:items-baseline sm:py-8">
              <span className="text-[0.9375rem] font-semibold text-brand tabular-nums">
                {milestone.year}
              </span>

              <h3 className="type-h3">{t(`items.${milestone.id}.title`)}</h3>

              <p className="type-small max-w-2xl">{t(`items.${milestone.id}.description`)}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
