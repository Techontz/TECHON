import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { BookingFlow } from '@/components/booking/booking-flow'
import { Eyebrow } from '@/components/ui/section'
import { routing } from '@/i18n/routing'
import { site } from '@/lib/site'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'booking.meta' })

  const path = locale === routing.defaultLocale ? '/book' : `/${locale}/book`

  return {
    // `absolute` so the pipe form survives the layout's "%s — TechOn" template.
    title: { absolute: `${t('title')} | ${site.name}` },
    description: t('description'),
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        routing.locales.map((code) => [
          code,
          code === routing.defaultLocale ? '/book' : `/${code}/book`,
        ]),
      ),
    },
    openGraph: {
      title: `${t('title')} | ${site.name}`,
      description: t('description'),
      url: path,
    },
  }
}

/**
 * The booking page.
 *
 * A standalone, shareable URL — a client can be sent `techontz.com/book`
 * directly. The site header stays in place so a recipient who has never
 * visited before can reach the rest of the company from here.
 */
export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'booking' })

  return (
    <div className="pt-14 pb-24 sm:pt-20 sm:pb-32">
      <div className="container-page">
        <header className="mx-auto max-w-2xl text-center">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className="type-h1 mt-4 text-balance">{t('title')}</h1>
          <p className="type-lead mx-auto mt-5">{t('subtitle')}</p>
        </header>

        <div className="mx-auto mt-14 max-w-3xl sm:mt-20">
          <BookingFlow />
        </div>
      </div>
    </div>
  )
}
