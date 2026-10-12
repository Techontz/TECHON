import type { Metadata, Viewport } from 'next'
import { Geist, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { routing } from '@/i18n/routing'
import { site } from '@/lib/site'

import '../globals.css'

/** Body copy. Inter holds up from 13px labels to 21px leads. */
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

/** Headlines. Tighter and more geometric than Inter at display sizes. */
const geist = Geist({ subsets: ['latin'], variable: '--font-display', display: 'swap' })

/** Pre-renders all four locales at build time instead of on demand. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    metadataBase: new URL(site.url),
    title: { default: t('title'), template: `%s | ${site.name}` },
    description: t('description'),
    applicationName: site.name,
    authors: [{ name: site.legalName, url: site.url }],
    creator: site.legalName,
    publisher: site.legalName,
    keywords: [
      'software development',
      'AI solutions',
      'AI agents',
      'mobile app development',
      'enterprise systems',
      'digital transformation',
      'Next.js development',
      'Tanzania software company',
    ],
    alternates: {
      canonical: locale === routing.defaultLocale ? '/' : `/${locale}`,
      // Tells search engines these four pages are the same content in
      // different languages rather than duplicates competing with each other.
      languages: Object.fromEntries(
        routing.locales.map((code) => [
          code,
          code === routing.defaultLocale ? '/' : `/${code}`,
        ]),
      ),
    },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: t('title'),
      description: t('description'),
      url: locale === routing.defaultLocale ? site.url : `${site.url}/${locale}`,
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
        { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: { url: '/apple-icon.png', sizes: '180x180' },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  // Never cap zoom — doing so is an accessibility failure, not a polish win.
  maximumScale: 5,
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  // Opts this route into static rendering; without it every page becomes
  // dynamic the moment a translation is read.
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'meta' })

  const organisationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    logo: `${site.url}${site.logo.src}`,
    email: site.contact.email,
    telephone: site.contact.phones.map((phone) => phone.e164),
    foundingDate: site.founded,
    description: t('description'),
    sameAs: site.socials.map((social) => social.href),
    // Both lines published as contact points, so search results and dialers
    // pick up the right number for the visitor's region.
    contactPoint: site.contact.phones.map((phone) => ({
      '@type': 'ContactPoint',
      telephone: phone.e164,
      email: site.contact.email,
      contactType: 'customer support',
      areaServed: phone.regionKey === 'tanzania' ? 'TZ' : 'US',
      availableLanguage: routing.locales.map((code) => code.toUpperCase()),
    })),
    address: site.offices.map((office) => ({
      '@type': 'PostalAddress',
      addressLocality: office.city,
      addressCountry: office.code,
    })),
  }

  return (
    <html lang={locale} className={`${inter.variable} ${geist.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          // Static, developer-authored JSON — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
        />

        <NextIntlClientProvider>
          <div id="top" className="flex min-h-screen flex-col">
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </NextIntlClientProvider>

        <Analytics />
      </body>
    </html>
  )
}
