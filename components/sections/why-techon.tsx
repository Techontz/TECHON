import { useTranslations } from 'next-intl'

import { Counter } from '@/components/motion/counter'
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/ui/section'
import { points, stats } from '@/data/why'

export function WhyTechOn() {
  const t = useTranslations('why')

  return (
    <Section id="why" divided>
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
        align="center"
      />

      {/* Stats. One ruled row rather than four cards — the numbers belong
          together, and separate cards would imply otherwise. */}
      <Reveal className="mt-14 sm:mt-16">
        <dl className="grid grid-cols-2 gap-y-10 border-y border-line py-10 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={stat.id} className="px-4 text-center">
              <dd className="text-[2rem] font-semibold tracking-[-0.03em] text-ink tabular-nums sm:text-[2.75rem]">
                <Counter value={stat.value} suffix={stat.suffix} delay={index * 0.08} />
              </dd>
              <dt className="mt-2 text-[0.875rem] text-ink-muted">
                {t(`stats.${stat.id}`)}
              </dt>
            </div>
          ))}
        </dl>
      </Reveal>

      <RevealGroup
        as="ul"
        className="mt-16 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-12"
      >
        {points.map((point) => {
          const Icon = point.icon

          return (
            <RevealItem key={point.id} as="li" className="border-t border-line py-8">
              <Icon className="size-5 text-brand" aria-hidden />
              <h3 className="type-h3 mt-4">{t(`points.${point.id}.title`)}</h3>
              <p className="type-small mt-2">{t(`points.${point.id}.description`)}</p>
            </RevealItem>
          )
        })}
      </RevealGroup>
    </Section>
  )
}
