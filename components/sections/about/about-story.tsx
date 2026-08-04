import { useTranslations } from 'next-intl'

import { Reveal } from '@/components/motion/reveal'
import { Eyebrow, Section } from '@/components/ui/section'

/**
 * Who we are, mission and vision.
 *
 * Three statements in one section rather than three sections: they answer the
 * same question, and separating them would put 140px of silence between
 * sentences that belong together.
 */
export function AboutStory() {
  const t = useTranslations('about')

  return (
    <Section divided>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-20">
        <Reveal>
          <Eyebrow>{t('who.eyebrow')}</Eyebrow>
          <h2 className="type-h2 mt-3">{t('who.title')}</h2>
        </Reveal>

        <Reveal className="max-w-2xl space-y-5">
          <p className="type-lead">{t('who.body1')}</p>
          <p className="type-body">{t('who.body2')}</p>
        </Reveal>
      </div>

      {/* Mission and vision, side by side and equally weighted. */}
      <div className="mt-20 grid gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:mt-24 lg:grid-cols-2">
        <Reveal className="bg-white p-8 sm:p-10">
          <Eyebrow>{t('mission.eyebrow')}</Eyebrow>
          {/* h2, not h3: mission and vision are peers of "who we are", not
              subsections of it — the visual size comes from the class. */}
          <h2 className="type-h3 mt-3 text-[1.375rem] sm:text-[1.625rem]">{t('mission.title')}</h2>
          <p className="type-body mt-4">{t('mission.body')}</p>
        </Reveal>

        <Reveal className="bg-white p-8 sm:p-10">
          <Eyebrow>{t('vision.eyebrow')}</Eyebrow>
          {/* h2, not h3: mission and vision are peers of "who we are", not
              subsections of it — the visual size comes from the class. */}
          <h2 className="type-h3 mt-3 text-[1.375rem] sm:text-[1.625rem]">{t('vision.title')}</h2>
          <p className="type-body mt-4">{t('vision.body')}</p>
        </Reveal>
      </div>
    </Section>
  )
}
