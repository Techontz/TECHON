import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal'
import { NovaPhone } from '@/components/sections/nova-phone'
import { ActionLink } from '@/components/ui/action-link'
import { Eyebrow } from '@/components/ui/section'
import { novaGroups, novaMetrics } from '@/data/nova'

/**
 * The flagship product, staged as a product announcement.
 *
 * Centred type, one large visual, then the specification. The section carries
 * the most vertical space on the page and the only sustained motion — all of
 * it inside the handset.
 */
export function Nova() {
  const t = useTranslations('nova')

  return (
    <section id="nova" className="section-y border-t border-line bg-surface">
      <div className="container-page">
        {/* Statement */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow>{t('eyebrow')}</Eyebrow>

          <h2 className="type-display mt-4 text-balance">{t('title')}</h2>

          <p className="type-lead mx-auto mt-6 max-w-2xl">{t('lead')}</p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <ActionLink href="/#contact" size="lg">
              {t('cta')}
            </ActionLink>
            <ActionLink href="/book" variant="secondary" size="lg">
              {t('secondary')}
            </ActionLink>
          </div>
        </Reveal>

        {/* Product */}
        <Reveal className="mt-16 sm:mt-20">
          <NovaPhone />
        </Reveal>

        <Reveal className="mx-auto mt-14 max-w-2xl sm:mt-16">
          <dl className="grid grid-cols-3 gap-4 border-y border-line py-8">
            {novaMetrics.map((metric) => (
              <div key={metric.key} className="text-center">
                <dd className="text-[1.5rem] font-semibold tracking-[-0.03em] text-ink tabular-nums sm:text-[2rem]">
                  {metric.value}
                </dd>
                <dt className="mt-1.5 text-[0.75rem] leading-snug text-ink-muted sm:text-[0.8125rem]">
                  {t(metric.key)}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Specification. Four cards rather than twenty-two — grouped, the
            list reads as a specification; flat, it reads as a wall. */}
        <Reveal className="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
          <h3 className="type-h2">{t('capabilitiesTitle')}</h3>
          <p className="type-lead mt-4">{t('capabilitiesLead')}</p>
        </Reveal>

        <RevealGroup
          as="ul"
          className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.06}
        >
          {novaGroups.map((group) => {
            const Icon = group.icon

            return (
              <RevealItem key={group.id} as="li">
                <div className="card-surface flex h-full flex-col rounded-[10px] bg-white p-6">
                  <Icon className="size-5 text-brand" aria-hidden />

                  <h4 className="type-h3 mt-4 text-[1.0625rem]">{t(`groups.${group.id}`)}</h4>

                  <ul className="mt-4 space-y-2.5">
                    {group.capabilities.map((capability) => (
                      <li key={capability} className="flex items-start gap-2.5">
                        <Check className="mt-[3px] size-3.5 shrink-0 text-brand" aria-hidden />
                        <span className="text-[0.875rem] leading-snug text-ink-muted">
                          {t(`capabilities.${capability}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </div>
    </section>
  )
}
