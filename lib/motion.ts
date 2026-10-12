import type { Variants } from 'framer-motion'

/**
 * Motion language.
 *
 * The whole vocabulary is opacity, ≤32px of travel and ≤0.02 of scale. Motion
 * here exists to make the page feel settled, never to be noticed as an effect.
 * If an animation draws attention to itself, it is wrong.
 */

/** Apple's standard deceleration. Fast start, long soft landing. */
export const ease = [0.32, 0.72, 0, 1] as const

export const duration = {
  fast: 0.25,
  // Apple's section reveals are slow and long-travelled; the page settles
  // into place rather than snapping.
  base: 0.9,
} as const

/** Fires slightly before the element reaches the viewport edge. */
export const viewport = { once: true, margin: '-10% 0px -10% 0px' } as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease } },
}

/**
 * Parent variant for lists. Children inherit `hidden`/`visible`, so a grid
 * needs one `whileInView` on the wrapper rather than an observer per card.
 */
export function stagger(childDelay = 0.05, initialDelay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: childDelay, delayChildren: initialDelay },
    },
  }
}
