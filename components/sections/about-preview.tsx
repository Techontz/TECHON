import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Reveal } from '@/components/motion/reveal'
import { ActionLink } from '@/components/ui/action-link'
import { Eyebrow, Section } from '@/components/ui/section'
import { Portrait } from '@/components/ui/portrait'
import { leaders } from '@/data/leadership'

/**
 * Homepage introduction to the company.
 *
 * One paragraph and a name — the full story lives on /about. This exists to
 * give the page a human centre before the proof sections, not to tell the
 * whole history.
 */
export function AboutPreview() {
  const t = useTranslations('aboutPreview')
  const about = useTranslations('about')
  const [ceo] = leaders

  return (
    <Section divided>
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <Eyebrow>{t('eyebrow')}</Eyebrow>

          <h2 className="type-h2 mt-3 max-w-lg">{t('title')}</h2>

          <p className="type-lead mt-6 max-w-xl">{t('body')}</p>

          <div className="mt-8 border-t border-line pt-6">
            <p className="text-[1rem] font-medium text-ink">{ceo.name}</p>
            <p className="type-small mt-1 text-[0.875rem]">{t('ceoRole')}</p>
          </div>

          <div className="mt-8">
            <ActionLink
              href="/about"
              variant="secondary"
              icon={<ArrowRight className="size-4" aria-hidden />}
            >
              {t('cta')}
            </ActionLink>
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2 lg:justify-self-end">
          {/* 4:5 matches the source portrait's own 3:4 closely enough that
              object-cover trims edges rather than cropping the subject. */}
          <Portrait
            name={ceo.name}
            image={ceo.image}
            pendingLabel={about('leadership.portraitPending')}
            className="mx-auto aspect-[4/5] w-full max-w-xs sm:max-w-sm lg:max-w-md"
            sizes="(min-width: 1024px) 28rem, (min-width: 640px) 24rem, 20rem"
          />
        </Reveal>
      </div>
    </Section>
  )
}
