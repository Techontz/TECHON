import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

/**
 * Locale-aware navigation primitives.
 *
 * Import `Link`, `useRouter` and friends from here rather than from `next/*`
 * — these keep the active locale in the href automatically, so a Swahili
 * visitor clicking "Portfolio" lands on `/sw/portfolio`, not `/portfolio`.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
