import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { PortfolioGallery } from '@/components/sections/portfolio-gallery'
import { routing } from '@/i18n/routing'
import { projects } from '@/data/projects'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'portfolioPage' })

  const path = locale === routing.defaultLocale ? '/portfolio' : `/${locale}/portfolio`

  return {
    title: t('title'),
    description: `${t('lead')} ${projects.length} projects.`,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        routing.locales.map((code) => [
          code,
          code === routing.defaultLocale ? '/portfolio' : `/${code}/portfolio`,
        ]),
      ),
    },
    openGraph: { title: t('title'), description: t('lead'), url: path },
  }
}

/**
 * Server component so the page ships real metadata; only the filtering UI
 * below it needs to be interactive.
 */
export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <PortfolioGallery />
}
