'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import { LocaleSwitcher } from '@/components/layout/locale-switcher'
import { ActionLink } from '@/components/ui/action-link'
import { Link } from '@/i18n/navigation'
import { ease } from '@/lib/motion'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

/** Order is deliberate: who we are, what we do, proof, product, how to reach us. */
const NAV = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/#services' },
  { key: 'portfolio', href: '/portfolio' },
  { key: 'nova', href: '/#nova' },
  { key: 'contact', href: '/#contact' },
] as const

/**
 * Floating navigation.
 *
 * Detached from the viewport on all sides rather than pinned edge to edge —
 * the bar hovers over the page instead of capping it, which is what separates
 * a considered header from a browser chrome imitation.
 *
 * It stays a floating card at every scroll position; only the shadow and the
 * backdrop blur deepen as content passes beneath, so nothing jumps.
 */
export function Header() {
  const t = useTranslations('nav')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  // Read from the motion value rather than a scroll listener — it is already
  // batched into the frame loop instead of triggering its own layout pass.
  useMotionValueEvent(scrollY, 'change', (latest) => setIsScrolled(latest > 12))

  // Lock the page behind the mobile panel.
  useEffect(() => {
    if (!isMenuOpen) return

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  return (
    <>
      <a
        href="#main"
        className={cn(
          'sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3',
          'focus-visible:z-[100] focus-visible:rounded-[10px] focus-visible:bg-ink',
          'focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:text-white',
        )}
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 pt-3 sm:pt-4">
        <div className="container-page">
          <motion.div
            initial={false}
            animate={{
              // A near-invisible lift at rest, deepening once content is behind
              // it — the only thing that changes on scroll.
              boxShadow: isScrolled
                ? '0 1px 2px rgba(20,6,31,0.04), 0 8px 30px rgba(20,6,31,0.10)'
                : '0 1px 2px rgba(20,6,31,0.03), 0 4px 16px rgba(20,6,31,0.05)',
            }}
            transition={{ duration: 0.3, ease }}
            className={cn(
              'rounded-float border border-line/70 bg-white/80',
              'backdrop-blur-xl backdrop-saturate-150',
            )}
          >
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6">
              <Link
                href="/"
                aria-label={site.name}
                className="shrink-0 transition-opacity duration-200 hover:opacity-70"
              >
                <Image
                  src={site.logo.src}
                  alt={site.legalName}
                  width={site.logo.width}
                  height={site.logo.height}
                  priority
                  sizes="140px"
                  className="h-6 w-auto sm:h-7"
                />
              </Link>

              {/* Centred navigation, as in the references — the logo and the
                  call to action bracket it rather than crowd it.
                  Centred by flex rather than absolute positioning: at 1024px
                  six items plus the logo and the CTA exceed the bar's width,
                  and an absolutely-centred nav would silently overlap them. */}
              <nav
                aria-label="Primary"
                className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex"
              >
                {NAV.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                      'rounded-[10px] px-3.5 py-2 text-[0.9375rem] text-ink-muted',
                      'transition-colors duration-200 hover:bg-surface hover:text-ink',
                    )}
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </nav>

              <div className="flex shrink-0 items-center gap-1.5">
                <LocaleSwitcher />

                <ActionLink href="/book" size="sm" className="hidden sm:inline-flex">
                  {t('cta')}
                </ActionLink>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen((open) => !open)}
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label={isMenuOpen ? t('close') : t('menu')}
                  className="-mr-1 inline-flex size-10 items-center justify-center rounded-[10px] text-ink transition-colors hover:bg-surface lg:hidden"
                >
                  {isMenuOpen ? (
                    <X className="size-5" aria-hidden />
                  ) : (
                    <Menu className="size-5" aria-hidden />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-page flex h-full flex-col pt-28 pb-10">
              <nav aria-label="Mobile" className="flex flex-col">
                {NAV.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease, delay: 0.03 + index * 0.035 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block border-b border-line py-4 text-[1.5rem] font-medium tracking-[-0.025em] text-ink"
                    >
                      {t(item.key)}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto pt-8">
                <ActionLink
                  href="/book"
                  size="lg"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('cta')}
                </ActionLink>

                <p className="mt-5 text-center text-[0.875rem] text-ink-muted">
                  {site.contact.email}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
