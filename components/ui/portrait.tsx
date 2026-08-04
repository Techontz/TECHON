import Image from 'next/image'

import { cn } from '@/lib/utils'

interface PortraitProps {
  name: string
  /** Path in `public/`. Without it the monogram placeholder renders instead. */
  image?: string
  /** Shown under the monogram while no photograph exists. */
  pendingLabel?: string
  className?: string
  sizes?: string
  priority?: boolean
}

/** First letters of the first two words — "Conrad Bubex" → "CB". */
function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

/**
 * A leadership portrait.
 *
 * Falls back to a monogram tile rather than a stock photograph or a grey
 * silhouette — a placeholder that is obviously a placeholder is more honest
 * than one pretending to be a person. Both states fill the same box, so
 * dropping in the real photograph shifts nothing.
 */
export function Portrait({
  name,
  image,
  pendingLabel,
  className,
  sizes = '(min-width: 1024px) 28rem, 90vw',
  priority = false,
}: PortraitProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[10px] border border-line bg-surface',
        className,
      )}
    >
      {image ? (
        <Image src={image} alt={name} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span
            aria-hidden
            className="flex size-16 items-center justify-center rounded-full bg-white text-[1.125rem] font-semibold tracking-tight text-ink-muted shadow-xs"
          >
            {initials(name)}
          </span>
          {pendingLabel ? (
            <span className="text-[0.75rem] text-ink-subtle">{pendingLabel}</span>
          ) : null}
        </div>
      )}
    </div>
  )
}
