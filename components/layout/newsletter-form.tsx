'use client'

import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useId, useState, type FormEvent } from 'react'

import { ActionButton } from '@/components/ui/action-link'
import { cn } from '@/lib/utils'

/** Deliberately permissive — a server is the only place worth being strict. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Newsletter capture.
 *
 * The site has no backend, so submission is validated and acknowledged
 * locally. Point the success branch at a real endpoint when one exists — the
 * states are already here.
 */
export function NewsletterForm() {
  const t = useTranslations('footer')
  const inputId = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'done'>('idle')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!EMAIL.test(email.trim())) {
      setStatus('error')
      return
    }

    setStatus('done')
    setEmail('')
  }

  if (status === 'done') {
    return (
      <p className="flex h-11 items-center gap-2 text-[0.9375rem] text-success">
        <Check className="size-4 shrink-0" aria-hidden />
        {t('subscribed')}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex gap-2">
        <label htmlFor={inputId} className="sr-only">
          {t('newsletter')}
        </label>

        <input
          id={inputId}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder={t('placeholder')}
          aria-invalid={status === 'error'}
          aria-describedby={status === 'error' ? `${inputId}-error` : undefined}
          className={cn(
            'h-11 min-w-0 flex-1 rounded-[10px] border bg-white px-3.5',
            'text-[0.9375rem] text-ink placeholder:text-ink-subtle',
            'transition-colors duration-200 outline-none',
            status === 'error'
              ? 'border-destructive'
              : 'border-line focus:border-brand',
          )}
        />

        <ActionButton type="submit" size="md" className="shrink-0">
          {t('subscribe')}
        </ActionButton>
      </div>

      {status === 'error' ? (
        <p id={`${inputId}-error`} role="alert" className="mt-2 text-[0.8125rem] text-destructive">
          {t('invalid')}
        </p>
      ) : null}
    </form>
  )
}
