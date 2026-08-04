import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'

import { routing } from './routing'

/**
 * Resolves the message bundle for each request.
 *
 * Messages are imported per locale, so a page only ever ships the strings for
 * the language it is rendering.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
