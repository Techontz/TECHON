import { cn } from '@/lib/utils'
import type { TechItem } from '@/data/tech-stack'

/**
 * A technology glyph, drawn in `currentColor` so the parent controls tone.
 *
 * Falls back to the brand set in type where no permissively-licensed path
 * exists — currently only AWS.
 */
export function BrandIcon({ item, className }: { item: TechItem; className?: string }) {
  if (!item.path) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center text-[0.75rem] font-bold tracking-tight',
          className,
        )}
      >
        {item.wordmark ?? item.name}
      </span>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-hidden
      focusable="false"
      fill="currentColor"
      className={cn('size-full', className)}
    >
      <path d={item.path} />
    </svg>
  )
}
