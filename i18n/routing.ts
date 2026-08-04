import { defineRouting } from 'next-intl/routing'

/**
 * Locale routing.
 *
 * `as-needed` keeps English on bare paths (`/`, `/portfolio`) and prefixes
 * only the others (`/sw`, `/fr/portfolio`). That preserves every existing URL
 * while still giving each language a real, indexable address.
 */
export const routing = defineRouting({
  locales: ['en', 'sw', 'fr', 'de'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]

/** Display metadata for the language switcher. */
export const localeNames: Record<Locale, { label: string; native: string }> = {
  en: { label: 'English', native: 'English' },
  sw: { label: 'Swahili', native: 'Kiswahili' },
  fr: { label: 'French', native: 'Français' },
  de: { label: 'German', native: 'Deutsch' },
}
