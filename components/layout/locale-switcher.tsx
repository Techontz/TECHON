'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import { useEffect, useRef, useState, useTransition } from 'react'

import { usePathname, useRouter } from '@/i18n/navigation'
import { localeNames, routing, type Locale } from '@/i18n/routing'
import { ease } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Language menu.
 *
 * Switching pushes the same pathname under a new locale, so a visitor reading
 * `/portfolio` lands on `/fr/portfolio` rather than being dropped at the home
 * page — the single most common failure of bolted-on language switchers.
 */
export function LocaleSwitcher({ align = 'end' }: { align?: 'start' | 'end' }) {
  const t = useTranslations('nav')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  function select(next: Locale) {
    setIsOpen(false)
    if (next === locale) return

    startTransition(() => {
      // Replaces rather than pushes: switching language is a re-render of the
      // current page, not a new step in the visitor's history.
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`${t('language')}: ${localeNames[locale].label}`}
        disabled={isPending}
        className={cn(
          'inline-flex h-9 items-center gap-1 rounded-[8px] px-2.5',
          'text-[0.875rem] font-medium text-ink-muted',
          'transition-colors duration-200 hover:bg-surface hover:text-ink',
          'disabled:opacity-50',
          isOpen && 'bg-surface text-ink',
        )}
      >
        <span className="uppercase">{locale}</span>
        <ChevronDown
          className={cn('size-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease }}
            className={cn(
              'absolute top-full z-50 mt-2 w-44 overflow-hidden rounded-[10px]',
              'border border-line bg-white p-1 shadow-md',
              align === 'end' ? 'right-0' : 'left-0',
            )}
          >
            {routing.locales.map((code) => {
              const isActive = code === locale

              return (
                <button
                  key={code}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isActive}
                  onClick={() => select(code)}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-[6px] px-2.5 py-2',
                    'text-left text-[0.875rem] transition-colors duration-150',
                    isActive ? 'text-ink' : 'text-ink-muted hover:bg-surface hover:text-ink',
                  )}
                >
                  {localeNames[code].native}
                  {isActive ? <Check className="size-3.5 text-brand" aria-hidden /> : null}
                </button>
              )
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
