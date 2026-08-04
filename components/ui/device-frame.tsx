import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface BrowserFrameProps {
  children: ReactNode
  /** Shown in the address pill. Kept short — it is set at 11px. */
  url?: string
  className?: string
}

/**
 * Desktop window chrome.
 *
 * Deliberately understated: three grey dots and an address pill, no gradients
 * or gloss. The chrome exists to frame the screenshot, not to be looked at.
 */
export function BrowserFrame({ children, url, className }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[12px] border border-line bg-white shadow-md',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
        </span>

        {url ? (
          <span className="mx-auto hidden rounded-[6px] bg-white px-3 py-1 text-[0.6875rem] text-ink-subtle sm:block">
            {url}
          </span>
        ) : null}

        {/* Balances the traffic lights so the address pill sits optically centred. */}
        <span className="hidden w-[52px] sm:block" aria-hidden />
      </div>

      {children}
    </div>
  )
}

interface PhoneFrameProps {
  children: ReactNode
  className?: string
}

/**
 * Handset silhouette.
 *
 * The bezel radius intentionally exceeds the card ceiling — this is a drawing
 * of a device, not a card, and a phone with 14px corners reads as a mistake.
 */
export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[2.25rem] border border-line bg-white p-2 shadow-md',
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.75rem] bg-surface">
        {/* Dynamic island */}
        <span
          aria-hidden
          className="absolute top-2 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-ink/85"
        />
        {children}
      </div>
    </div>
  )
}
