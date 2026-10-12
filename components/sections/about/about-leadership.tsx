import { Instagram } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Reveal } from '@/components/motion/reveal'
import { ActionLink } from '@/components/ui/action-link'
import { Portrait } from '@/components/ui/portrait'
import { Eyebrow, Section } from '@/components/ui/section'
import { leaders } from '@/data/leadership'

/**
 * Leadership.
 *
 * Written as a short introduction with two credentials set as quiet metadata,
 * not as a résumé. Qualifications sit in a ruled list under a single label so
 * the section stays typographic — the moment each degree gets its own card it
 * starts reading as a CV.
 */
export function AboutLeadership() {
  const t = useTranslations('about.leadership')
  const [ceo] = leaders

  return (
    <Section divided>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <Portrait
            name={ceo.name}
            image={ceo.image}
            pendingLabel={t('portraitPending')}
            className="aspect-[4/5] w-full max-w-md"
            sizes="(min-width: 1024px) 30rem, 90vw"
          />
        </Reveal>

        <Reveal>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2 className="type-h2 mt-3">{t('title')}</h2>
          <p className="type-lead mt-5 max-w-xl">{t('lead')}</p>

          <div className="mt-10 border-t border-line pt-8">
            <p className="text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">
              {ceo.name}
            </p>
            <p className="type-small mt-1">{t('role')}</p>

            <p className="type-body mt-6 max-w-xl">{t('bio')}</p>
          </div>

          <div className="mt-10">
            <h3 className="text-[0.8125rem] font-semibold text-ink">{t('educationLabel')}</h3>

            <ul className="mt-4">
              {ceo.qualifications.map((qualification) => (
                <li
                  key={qualification.id}
                  className="border-t border-line py-4 last:border-b"
                >
                  <p className="text-[0.9375rem] font-medium text-ink">
                    {t(`qualifications.${qualification.id}`)}
                  </p>
                  <p className="mt-1 text-[0.875rem] text-ink-muted">
                    {qualification.institution}
                    <span aria-hidden className="mx-2 text-ink-subtle">
                      ·
                    </span>
                    {qualification.location}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            {ceo.instagram ? (
              <ActionLink
                href={ceo.instagram}
                external
                variant="secondary"
                icon={<Instagram className="size-4" aria-hidden />}
              >
                {t('followInstagram')}
              </ActionLink>
            ) : null}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
