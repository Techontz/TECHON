import { useTranslations } from 'next-intl'

import { Reveal } from '@/components/motion/reveal'
import { ActionLink } from '@/components/ui/action-link'
import { site, telLink } from '@/lib/site'

export function AboutCta() {
  const t = useTranslations('about.cta')
  const contact = useTranslations('contact')

  return (
    <section className="section-y border-t border-line">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="type-h1 text-balance">{t('title')}</h2>
          <p className="type-lead mx-auto mt-6">{t('lead')}</p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <ActionLink href="/book" size="lg">
              {t('primary')}
            </ActionLink>
            <ActionLink href="/portfolio" variant="secondary" size="lg">
              {t('secondary')}
            </ActionLink>
          </div>

          <p className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[0.875rem]">
            <a
              href={`mailto:${site.contact.email}`}
              className="text-ink transition-colors hover:text-brand"
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
                  className="text-ink transition-colors hover:text-brand"
                >
                  {phone.display}
                </a>
              </span>
            ))}
          </p>

          <p className="mt-2 text-[0.75rem] text-ink-subtle">{contact('response')}</p>
        </Reveal>
      </div>
    </section>
  )
}
