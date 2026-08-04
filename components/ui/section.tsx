import type { ReactNode } from 'react'

import { Reveal } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: ReactNode
  id?: string
  className?: string
  /** `subtle` is the alternating #F8F8FA band; `white` is the default canvas. */
  tone?: 'white' | 'subtle'
  /** Adds a hairline above the section instead of relying on a tone change. */
  divided?: boolean
}

/**
 * Standard section wrapper.
 *
 * Owns the 140px vertical rhythm and the container width so no section can
 * invent its own. Consistent spacing is most of what makes a page read as
 * composed rather than assembled.
 */
export function Section({
  children,
  id,
  className,
  tone = 'white',
  divided = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'section-y',
        tone === 'subtle' && 'bg-surface',
        divided && 'border-t border-line',
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  )
}

/** Small brand-coloured label above a heading. The only coloured text on the page. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('type-eyebrow', className)}>{children}</p>
}

interface SectionHeaderProps {
  eyebrow?: string
  title: ReactNode
  lead?: string
  align?: 'left' | 'center'
  className?: string
  /** Rendered to the right of the heading on wide screens — usually a link. */
  action?: ReactNode
}

/**
 * Eyebrow, heading and lead, revealed together.
 *
 * Every section uses this, which is what keeps heading size, spacing and
 * reveal timing identical from the top of the page to the bottom.
 */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = 'left',
  className,
  action,
}: SectionHeaderProps) {
  const centered = align === 'center'

  return (
    <Reveal
      className={cn(
        'flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between',
        centered && 'sm:flex-col sm:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'mx-auto text-center')}>
        {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
        <h2 className="type-h2">{title}</h2>
        {lead ? <p className="type-lead mt-4 max-w-xl">{lead}</p> : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  )
}
