import { useTranslations } from 'next-intl'

import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/ui/section'
import { values } from '@/data/about'

export function AboutValues() {
  const t = useTranslations('about.values')

  return (
    <Section tone="subtle" divided>
      <SectionHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

      <RevealGroup
        as="ul"
        className="mt-14 grid gap-x-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14"
        stagger={0.04}
      >
        {values.map((value) => {
          const Icon = value.icon

          return (
            <RevealItem key={value.id} as="li" className="border-t border-line py-8">
              <Icon className="size-5 text-brand" aria-hidden />
              <h3 className="type-h3 mt-4">{t(`items.${value.id}.title`)}</h3>
              <p className="type-small mt-2 max-w-sm">{t(`items.${value.id}.description`)}</p>
            </RevealItem>
          )
        })}
      </RevealGroup>
    </Section>
  )
}
