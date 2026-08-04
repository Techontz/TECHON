'use client'

import { useTranslations } from 'next-intl'

import { SelectField, TextField } from '@/components/booking/form-controls'
import { countries } from '@/data/booking-options'
import type { BookingDraft, FieldErrors } from '@/lib/booking'

interface ContactFormProps {
  draft: BookingDraft
  errors: FieldErrors
  onChange: (patch: Partial<BookingDraft>) => void
}

/** Step 5 — who we are meeting. */
export function ContactForm({ draft, errors, onChange }: ContactFormProps) {
  const t = useTranslations('booking.contact')
  const messages = useTranslations('booking.errors')

  /** Maps a field's error code to its message; undefined when valid. */
  const errorFor = (field: keyof FieldErrors) => {
    const code = errors[field]
    return code ? messages(`${field}.${code}`) : undefined
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField
        label={t('firstName')}
        value={draft.firstName}
        onChange={(event) => onChange({ firstName: event.target.value })}
        autoComplete="given-name"
        error={errorFor('firstName')}
      />

      <TextField
        label={t('lastName')}
        value={draft.lastName}
        onChange={(event) => onChange({ lastName: event.target.value })}
        autoComplete="family-name"
        error={errorFor('lastName')}
      />

      <TextField
        label={t('company')}
        optional={t('optional')}
        value={draft.company}
        onChange={(event) => onChange({ company: event.target.value })}
        autoComplete="organization"
        className="sm:col-span-2"
      />

      <TextField
        label={t('email')}
        type="email"
        inputMode="email"
        value={draft.email}
        onChange={(event) => onChange({ email: event.target.value })}
        autoComplete="email"
        error={errorFor('email')}
      />

      <TextField
        label={t('phone')}
        type="tel"
        inputMode="tel"
        value={draft.phone}
        onChange={(event) => onChange({ phone: event.target.value })}
        autoComplete="tel"
        error={errorFor('phone')}
      />

      <SelectField
        label={t('country')}
        placeholder={t('countryPlaceholder')}
        value={draft.country}
        onChange={(event) => onChange({ country: event.target.value })}
        autoComplete="country-name"
        error={errorFor('country')}
        className="sm:col-span-2"
        // Names are proper nouns and stay untranslated; the code is what a
        // backend would store.
        options={countries.map((country) => ({ value: country.code, label: country.name }))}
      />
    </div>
  )
}
