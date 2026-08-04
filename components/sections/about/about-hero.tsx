import { useTranslations } from 'next-intl'

import { Reveal } from '@/components/motion/reveal'
import { Eyebrow } from '@/components/ui/section'
import { stats } from '@/data/why'

export function AboutHero() {
  const t = useTranslations('about.hero')
  const why = useTranslations('why.stats')

  return (
    <section className="pt-16 pb-14 sm:pt-24 sm:pb-20">
      <div className="container-page">
        <Reveal className="max-w-3xl">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className="type-display mt-4 text-balance">{t('title')}</h1>
          <p className="type-lead mt-6 max-w-2xl">{t('lead')}</p>
        </Reveal>

        <Reveal className="mt-14 sm:mt-20">
          <dl className="grid grid-cols-2 gap-y-8 border-y border-line py-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="px-2">
                <dd className="text-[1.75rem] font-semibold tracking-[-0.03em] text-ink tabular-nums sm:text-[2.25rem]">
                  {stat.value}
                  {stat.suffix}
                </dd>
                <dt className="mt-1.5 text-[0.8125rem] text-ink-muted">{why(stat.id)}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
