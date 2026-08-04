import { CalendarDays, Mail, MessageCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Eyebrow } from '@/components/ui/section'
import { Link } from '@/i18n/navigation'
import { mailtoLink, site, telLink, whatsappLink } from '@/lib/site'
import { cn } from '@/lib/utils'

interface Channel {
  key: string
  icon: LucideIcon
  label: string
  hint: string
  href: string
  external: boolean
}

/**
 * Closing call to action.
 *
 * Three channels rather than a contact form: with no backend, a form would
 * either discard submissions silently or need a third-party service wired in.
 * All three of these reach a real inbox today.
 */
export function Contact() {
  const t = useTranslations('contact')

  const channels: Channel[] = [
    {
      key: 'whatsapp',
      icon: MessageCircle,
      label: t('whatsapp'),
      hint: t('whatsappHint'),
      href: whatsappLink(),
      external: true,
    },
    {
      key: 'email',
      icon: Mail,
      label: t('email'),
      hint: t('emailHint'),
      href: mailtoLink(),
      external: false,
    },
    {
      key: 'book',
      icon: CalendarDays,
      label: t('book'),
      hint: t('bookHint'),
      href: site.contact.consultation,
      external: false,
    },
  ]

  return (
    <section id="contact" className="section-y border-t border-line">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2 className="type-h1 mt-3 text-balance">{t('title')}</h2>
          <p className="type-lead mx-auto mt-6">{t('lead')}</p>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mx-auto mt-12 grid max-w-4xl gap-4 sm:mt-14 sm:grid-cols-3"
          stagger={0.06}
        >
          {channels.map((channel) => {
            const Icon = channel.icon

            return (
              <RevealItem key={channel.key} as="li">
                <Link
                  href={channel.href}
                  {...(channel.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className={cn(
                    'card-surface card-hover flex h-full flex-col items-center gap-2 rounded-[10px]',
                    'px-5 py-8 text-center',
                  )}
                >
                  <Icon className="size-5 text-brand" aria-hidden />
                  <span className="mt-2 text-[1rem] font-medium text-ink">{channel.label}</span>
                  <span className="text-[0.8125rem] text-ink-subtle">{channel.hint}</span>
                </Link>
              </RevealItem>
            )
          })}
        </RevealGroup>

        {/* Direct lines. Both numbers are dialable, and each is labelled with
            its region so an international caller knows which one to use. */}
        <Reveal className="mx-auto mt-10 max-w-4xl">
          <div className="grid gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-3">
            <div className="bg-white px-5 py-6 text-center">
              <p className="text-[0.75rem] font-semibold tracking-wide text-ink-subtle uppercase">
                {t('email')}
              </p>
              <a
                href={mailtoLink()}
                className="mt-2 block text-[0.9375rem] font-medium text-ink transition-colors hover:text-brand"
              >
                {site.contact.email}
              </a>
            </div>

            {site.contact.phones.map((phone) => (
              <div key={phone.e164} className="bg-white px-5 py-6 text-center">
                <p className="text-[0.75rem] font-semibold tracking-wide text-ink-subtle uppercase">
                  {t(`regions.${phone.regionKey}`)}
                </p>
                <a
                  href={telLink(phone.e164)}
                  className="mt-2 block text-[0.9375rem] font-medium text-ink transition-colors hover:text-brand"
                >
                  {phone.display}
                </a>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-[0.8125rem] text-ink-subtle">{t('response')}</p>
        </Reveal>
      </div>
    </section>
  )
}
