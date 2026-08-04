import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { Section, SectionHeader } from '@/components/ui/section'
import { Link } from '@/i18n/navigation'
import { services } from '@/data/services'
import { cn } from '@/lib/utils'

/**
 * The twelve capabilities.
 *
 * Separated by hairlines rather than boxed into cards — twelve bordered tiles
 * on one screen reads as a control panel, twelve ruled cells reads as an
 * index. Only the arrow moves on hover.
 */
export function Services() {
  const t = useTranslations('services')

  return (
    <Section id="services" divided>
      <SectionHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

      <RevealGroup
        as="ul"
        className="mt-14 grid gap-x-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-14"
        stagger={0.035}
      >
        {services.map((service) => {
          const Icon = service.icon

          return (
            <RevealItem key={service.id} as="li" className="border-t border-line">
              <Link
                href="/#contact"
                className={cn(
                  'group flex h-full flex-col py-8 transition-colors duration-200',
                )}
              >
                <Icon
                  className="size-5 text-ink-subtle transition-colors duration-200 group-hover:text-brand"
                  aria-hidden
                />

                <h3 className="type-h3 mt-4">{t(`items.${service.id}.title`)}</h3>

                <p className="type-small mt-2 max-w-sm flex-1">
                  {t(`items.${service.id}.description`)}
                </p>

                <ArrowUpRight
                  aria-hidden
                  className={cn(
                    'mt-5 size-4 text-ink-subtle transition-all duration-200',
                    'group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand',
                  )}
                />
              </Link>
            </RevealItem>
          )
        })}
      </RevealGroup>
    </Section>
  )
}
