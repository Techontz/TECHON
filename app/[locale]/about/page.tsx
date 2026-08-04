import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { AboutCta } from '@/components/sections/about/about-cta'
import { AboutHero } from '@/components/sections/about/about-hero'
import { AboutLeadership } from '@/components/sections/about/about-leadership'
import { AboutStory } from '@/components/sections/about/about-story'
import { AboutTimeline } from '@/components/sections/about/about-timeline'
import { AboutValues } from '@/components/sections/about/about-values'
import { TechStack } from '@/components/sections/tech-stack'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about.meta' })

  const path = locale === routing.defaultLocale ? '/about' : `/${locale}/about`

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        routing.locales.map((code) => [
          code,
          code === routing.defaultLocale ? '/about' : `/${code}/about`,
        ]),
      ),
    },
    openGraph: { title: t('title'), description: t('description'), url: path },
  }
}

/**
 * Section order tells the story in the order a visitor asks it: who, why,
 * what we believe, who leads, what we build with, how we got here, work with us.
 */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutLeadership />
      <TechStack namespace="about.stack" tone="subtle" align="left" />
      <AboutTimeline />
      <AboutCta />
    </>
  )
}
