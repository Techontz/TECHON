'use client'

import { useCountUp } from '@/hooks/use-count-up'
import { cn } from '@/lib/utils'

interface CounterProps {
  value: number
  suffix?: string
  prefix?: string
  className?: string
  delay?: number
}

/**
 * A number that counts up the first time it scrolls into view.
 *
 * `tabular-nums` is essential here — without it the glyph widths shift on every
 * frame and the whole stat visibly jitters as it counts.
 */
export function Counter({ value, suffix, prefix, className, delay }: CounterProps) {
  const { ref, value: current } = useCountUp(value, { delay })

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {current}
      {suffix}
    </span>
  )
}
