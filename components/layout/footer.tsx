import { useTranslations } from 'next-intl'
import Image from 'next/image'

import { NewsletterForm } from '@/components/layout/newsletter-form'
import { Link } from '@/i18n/navigation'
import { site, telLink } from '@/lib/site'
import { cn } from '@/lib/utils'

const linkClass = cn(
  'text-[0.9375rem] text-ink-muted transition-colors duration-200 hover:text-ink',
)

const NAV_LINKS = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/#services' },
  { key: 'portfolio', href: '/portfolio' },
  { key: 'nova', href: '/#nova' },
  { key: 'contact', href: '/#contact' },
  { key: 'book', href: '/book' },
] as const

export function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const contact = useTranslations('contact')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)] lg:gap-16">
          {/* Brand + newsletter */}
          <div className="max-w-sm">
            <Link href="/" aria-label={site.name} className="inline-block">
              <Image
                src={site.logo.src}
                alt={site.legalName}
                width={site.logo.width}
                height={site.logo.height}
                sizes="132px"
                className="h-7 w-auto"
              />
            </Link>

            <p className="type-small mt-5">{t('tagline')}</p>

            <div className="mt-8">
              <p className="text-[0.9375rem] font-medium text-ink">{t('newsletter')}</p>
              <p className="type-small mt-1.5 mb-4 text-[0.875rem]">{t('newsletterHint')}</p>
              <NewsletterForm />
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h2 className="mb-4 text-[0.8125rem] font-semibold text-ink">{t('navigation')}</h2>
              <ul className="space-y-3">
                {NAV_LINKS.map((item) => (
                  <li key={item.key}>
                    <Link href={item.href} className={linkClass}>
                      {nav(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact — every number and address resolves from lib/site.ts. */}
            <div>
              <h2 className="mb-4 text-[0.8125rem] font-semibold text-ink">{t('contact')}</h2>
              <ul className="space-y-3">
                <li>
                  <a href={`mailto:${site.contact.email}`} className={linkClass}>
                    {site.contact.email}
                  </a>
                </li>
                {site.contact.phones.map((phone) => (
                  <li key={phone.e164}>
                    <a href={telLink(phone.e164)} className={linkClass}>
                      {phone.display}
                    </a>
                    <span className="mt-0.5 block text-[0.75rem] text-ink-subtle">
                      {contact(`regions.${phone.regionKey}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h2 className="mb-4 text-[0.8125rem] font-semibold text-ink">{t('connect')}</h2>
              <ul className="space-y-3">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Offices */}
        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-8">
          {site.offices.map((office) => (
            <li key={office.city} className="flex items-baseline gap-2">
              <span className="text-[0.9375rem] text-ink">{office.city}</span>
              <span className="text-[0.8125rem] text-ink-subtle">{office.country}</span>
            </li>
          ))}
        </ul>

        {/* Legal */}
        <div className="mt-8 flex flex-col-reverse gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-ink-subtle">
            © {year} {site.legalName}. {t('rights')}
          </p>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-[0.8125rem] text-ink-subtle hover:text-ink">
              {t('privacy')}
            </Link>
            <Link href="/" className="text-[0.8125rem] text-ink-subtle hover:text-ink">
              {t('terms')}
            </Link>
            <a href="#top" className="text-[0.8125rem] text-ink-subtle hover:text-ink">
              {t('top')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
