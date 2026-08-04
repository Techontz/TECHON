import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  /**
   * Everything except Next internals, the API surface and anything with a file
   * extension — matching those would prefix asset URLs with a locale and break
   * the logo, icons and sitemap.
   */
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
