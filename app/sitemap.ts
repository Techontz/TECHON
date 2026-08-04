import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { site } from '@/lib/site'

/** Path for a route under a locale, honouring the `as-needed` prefix rule. */
function url(locale: string, path: string) {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`
  return `${site.url}${prefix}${path}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const routes = [
    { path: '', priority: 1 },
    { path: '/about', priority: 0.8 },
    { path: '/portfolio', priority: 0.8 },
    // The shareable booking URL — high priority because it is the page most
    // often sent directly to a prospect.
    { path: '/book', priority: 0.9 },
  ]

  return routes.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: url(locale, route.path),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: route.priority,
      // Every locale of a route points at all the others, so crawlers treat
      // them as translations rather than as competing duplicates.
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((code) => [code, url(code, route.path)]),
        ),
      },
    })),
  )
}
