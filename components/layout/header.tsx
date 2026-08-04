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
          'focus-visible:z-[100] focus-visible:rounded-[8px] focus-visible:bg-ink',
          'focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:text-white',
        )}
      >
        Skip to content
      </a>

      <header
        className={cn(
          'sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300',
          isScrolled
            ? 'border-b border-line bg-white/85 backdrop-blur-md backdrop-saturate-150'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="container-page">
          <div className="flex h-16 items-center justify-between gap-6">
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
                sizes="132px"
                className="h-6 w-auto sm:h-7"
              />
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {NAV.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    'rounded-[8px] px-3 py-2 text-[0.9375rem] text-ink-muted',
                    'transition-colors duration-200 hover:text-ink',
                  )}
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5">
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
                className="-mr-2 inline-flex size-10 items-center justify-center rounded-[8px] text-ink transition-colors hover:bg-surface lg:hidden"
              >
                {isMenuOpen ? (
                  <X className="size-5" aria-hidden />
                ) : (
                  <Menu className="size-5" aria-hidden />
                )}
              </button>
            </div>
          </div>
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
            className="fixed inset-0 top-16 z-40 bg-white lg:hidden"
          >
            <div className="container-page flex h-full flex-col py-8">
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
                      className="block border-b border-line py-4 text-[1.375rem] font-medium tracking-[-0.02em] text-ink"
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
