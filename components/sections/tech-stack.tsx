import { useTranslations } from 'next-intl'

import { RevealGroup, RevealItem } from '@/components/motion/reveal'
import { BrandIcon } from '@/components/ui/brand-icon'
import { Section, SectionHeader } from '@/components/ui/section'
import { techStack } from '@/data/tech-stack'

interface TechStackProps {
  /**
   * Which copy to render. The home page and the About page introduce the same
   * toolkit with different framing, so the component takes its heading from
   * whichever namespace it is given rather than being duplicated.
   */
  namespace?: 'stack' | 'about.stack'
  tone?: 'white' | 'subtle'
  align?: 'left' | 'center'
}

/**
 * The logo wall.
 *
 * Monochrome and evenly weighted: fifteen brand colours would fight everything
 * else on the page, and the point of this section is breadth, not any
 * individual vendor. Each mark simply darkens on hover.
 */
export function TechStack({
  namespace = 'stack',
  tone = 'white',
  align = 'center',
}: TechStackProps) {
  const t = useTranslations(namespace)

  return (
    <Section tone={tone} divided>
      <SectionHeader
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
        align={align}
      />

      <RevealGroup
        as="ul"
        className="mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:mt-16 sm:grid-cols-5"
        stagger={0.025}
      >
        {techStack.map((item) => (
          <RevealItem key={item.name} as="li" className="bg-white">
            <div className="group flex h-full flex-col items-center justify-center gap-3 px-3 py-8 transition-colors duration-200 hover:bg-surface">
              <span className="flex size-7 items-center justify-center text-ink-subtle transition-colors duration-200 group-hover:text-ink">
                <BrandIcon item={item} />
              </span>
              <span className="text-center text-[0.75rem] leading-tight text-ink-muted">
                {item.name}
              </span>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
