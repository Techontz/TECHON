import { useTranslations } from 'next-intl'

import { ActionLink } from '@/components/ui/action-link'

/** Rendered inside the locale layout, so it keeps the header and footer. */
export default function LocaleNotFound() {
  const t = useTranslations('notFound')

  return (
    <section className="flex min-h-[62vh] items-center py-24">
      <div className="container-page text-center">
        <p className="type-display text-line-strong">404</p>
        <h1 className="type-h2 mt-6">{t('title')}</h1>
        <p className="type-lead mx-auto mt-4 max-w-md">{t('lead')}</p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <ActionLink href="/" size="lg">
            {t('home')}
          </ActionLink>
          <ActionLink href="/portfolio" variant="secondary" size="lg">
            {t('work')}
          </ActionLink>
        </div>
      </div>
    </section>
  )
}
