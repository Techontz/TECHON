'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { useRouter } from '@/i18n/navigation'

/**
 * "Try for free": takes an email and carries it into the booking flow, which
 * pre-fills it, so the visitor never types it twice.
 */
export function NovaSignup() {
  const t = useTranslations('nova')
  const router = useRouter()
  const [email, setEmail] = useState('')

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const query = email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ''
        router.push(`/book${query}`)
      }}
      className="mx-auto flex w-full max-w-xl flex-col gap-2 rounded-[22px] border border-line bg-white/80 p-2 shadow-[0_10px_40px_-12px_rgba(60,20,90,0.18)] backdrop-blur-md sm:flex-row sm:items-center sm:rounded-full"
    >
      <label htmlFor="nova-email" className="sr-only">
        {t('emailPlaceholder')}
      </label>
      <input
        id="nova-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={t('emailPlaceholder')}
        className="h-12 min-w-0 flex-1 rounded-full bg-transparent px-5 text-[1rem] text-ink outline-none placeholder:text-ink-subtle"
      />
      <button
        type="submit"
        className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[0.9375rem] font-medium text-white transition-colors hover:bg-brand"
      >
        {t('tryFree')}
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </button>
    </form>
  )
}
