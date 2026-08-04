'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

interface CountUpOptions {
  duration?: number
  /** Held before counting starts, for staggering a row of stats. */
  delay?: number
}

/**
 * Counts from zero to `target` the first time the element enters view.
 *
 * Reduced-motion users get the final value immediately rather than a
 * stripped-down animation — a number that simply appears is not a lesser
 * experience, whereas one that jitters at 1fps is. That case is derived during
 * render rather than written to state, so no effect runs at all.
 */
export function useCountUp(target: number, { duration = 1.8, delay = 0 }: CountUpOptions = {}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })
  const prefersReducedMotion = useReducedMotion()
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return

    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setAnimated(Math.round(latest)),
    })

    return () => controls.stop()
  }, [isInView, target, duration, delay, prefersReducedMotion])

  return { ref, value: prefersReducedMotion ? target : animated }
}
