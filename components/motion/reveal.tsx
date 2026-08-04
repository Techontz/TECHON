'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

import { fadeUp, stagger, viewport } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Motion components resolved once, at module scope.
 *
 * Building these during render — via `motion.create()` or a dynamic
 * `motion[tag]` lookup — hands React a different component type on every pass,
 * which remounts the subtree and discards any animation in flight. A static map
 * keeps every type stable for the lifetime of the module.
 */
const TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  span: motion.span,
  p: motion.p,
  h2: motion.h2,
  h3: motion.h3,
} as const

type RevealTag = keyof typeof TAGS

interface RevealProps {
  children: ReactNode
  className?: string
  /** Seconds to hold before this element animates. */
  delay?: number
  variants?: Variants
  as?: RevealTag
}

/**
 * The site's default scroll reveal: 16px up, once, on the shared easing curve.
 *
 * Nesting a `Reveal` inside a `RevealGroup` is redundant — the group already
 * drives its children through variant inheritance. Use `RevealItem` there.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeUp,
  as = 'div',
}: RevealProps) {
  const Component = TAGS[as]

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={variants}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Component>
  )
}

interface RevealGroupProps {
  children: ReactNode
  className?: string
  /** Gap between each child's start, in seconds. */
  stagger?: number
  delay?: number
  as?: RevealTag
}

/**
 * Wraps a list so its children cascade. One `whileInView` for the whole grid
 * rather than an intersection observer per card.
 */
export function RevealGroup({
  children,
  className,
  stagger: staggerAmount = 0.06,
  delay = 0,
  as = 'div',
}: RevealGroupProps) {
  const Component = TAGS[as]

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger(staggerAmount, delay)}
    >
      {children}
    </Component>
  )
}

interface RevealItemProps {
  children: ReactNode
  className?: string
  variants?: Variants
  as?: RevealTag
}

/** A child of `RevealGroup`. Inherits `hidden`/`visible` from its parent. */
export function RevealItem({
  children,
  className,
  variants = fadeUp,
  as = 'div',
}: RevealItemProps) {
  const Component = TAGS[as]

  return (
    <Component className={cn(className)} variants={variants}>
      {children}
    </Component>
  )
}
