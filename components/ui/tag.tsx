import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type Tone = 'neutral' | 'brand' | 'success' | 'muted'

const tones: Record<Tone, string> = {
  neutral: 'border-line bg-white text-ink-muted',
  brand: 'border-transparent bg-brand-wash text-brand',
  success: 'border-transparent bg-[rgba(22,163,74,0.08)] text-success',
  // For placeholder states — visible but deliberately unemphatic.
  muted: 'border-line bg-surface text-ink-subtle',
}

interface TagProps {
  children: ReactNode
  tone?: Tone
  className?: string
}

/** Small metadata chip: technology names, statuses, counts. */
export function Tag({ children, tone = 'neutral', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[6px] border px-2 py-[3px]',
        'text-[0.75rem] leading-[1.3] font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
