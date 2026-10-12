import { Check, Globe, PhoneCall } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Reveal } from '@/components/motion/reveal'
import { NovaSignup } from '@/components/sections/nova-signup'
import { NovaStage } from '@/components/sections/nova-stage'
import { Eyebrow } from '@/components/ui/section'
import { novaGroups, novaMetrics } from '@/data/nova'

/**
 * The flagship product, staged as a launch: statement, the device family
 * running NOVA live, a one-field "try it", then the capabilities as two slow
 * ribbons instead of a wall of cards.
 */
export function Nova() {
  const t = useTranslations('nova')
  const capabilities = novaGroups.flatMap((group) => group.capabilities)
  const half = Math.ceil(capabilities.length / 2)

  return (
    <section id="nova" className="section-y border-t border-line bg-white">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[32px] bg-[radial-gradient(120%_80%_at_50%_0%,#f4edfa_0%,#fbfbfd_55%,#f5f5f7_100%)] px-5 pt-14 pb-10 sm:rounded-[44px] sm:px-10 sm:pt-20 sm:pb-14">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <h2 className="type-display mt-4 text-balance">{t('title')}</h2>
            <p className="type-lead mx-auto mt-5 max-w-2xl">{t('lead')}</p>
          </Reveal>

          <Reveal className="mt-10 sm:mt-14">
            <NovaStage />
          </Reveal>

          <Reveal className="mt-10 sm:mt-14">
            <NovaSignup />

            <ul className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
              {[
                { icon: PhoneCall, key: 'feature1' },
                { icon: Globe, key: 'feature2' },
              ].map(({ icon: Icon, key }) => (
                <li key={key} className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-brand shadow-xs">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="text-[0.9375rem] leading-snug text-ink">{t(key)}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mx-auto mt-10 max-w-2xl">
            <dl className="grid grid-cols-3 gap-4 border-t border-line pt-8">
              {novaMetrics.map((metric) => (
                <div key={metric.key} className="text-center">
                  <dd className="text-[1.5rem] font-semibold tracking-[-0.03em] text-ink tabular-nums sm:text-[2rem]">
                    {metric.value}
                  </dd>
                  <dt className="mt-1 text-[0.75rem] leading-snug text-ink-muted sm:text-[0.8125rem]">
                    {t(metric.key)}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Capabilities: two ribbons moving in opposite directions. */}
        <Reveal className="mt-14 text-center sm:mt-16">
          <h3 className="type-h2">{t('capabilitiesTitle')}</h3>
          <p className="type-lead mx-auto mt-3 max-w-xl">{t('capabilitiesLead')}</p>
        </Reveal>

        <div className="mask-fade-x mt-8 space-y-3 overflow-hidden">
          {[capabilities.slice(0, half), capabilities.slice(half)].map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="animate-marquee flex w-max gap-3 hover:[animation-play-state:paused]"
              style={
                {
                  '--marquee-duration': rowIndex === 0 ? '46s' : '54s',
                  animationDirection: rowIndex === 0 ? 'normal' : 'reverse',
                } as React.CSSProperties
              }
            >
              {/* Doubled so the loop is seamless; the copy is hidden from
                  assistive tech. */}
              {[...row, ...row].map((capability, index) => (
                <span
                  key={`${capability}-${index}`}
                  aria-hidden={index >= row.length ? true : undefined}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[0.875rem] text-ink"
                >
                  <Check className="size-3.5 text-brand" aria-hidden />
                  {t(`capabilities.${capability}`)}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
