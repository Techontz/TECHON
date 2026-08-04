'use client'

import { useTranslations } from 'next-intl'

import { SelectField, TextAreaField } from '@/components/booking/form-controls'
import { budgetIds, categoryIds } from '@/data/booking-options'
import type { BookingDraft, FieldErrors } from '@/lib/booking'

interface BudgetSelectorProps {
  draft: BookingDraft
  errors: FieldErrors
  onChange: (patch: Partial<BookingDraft>) => void
}

/**
 * Step 6 — what the project is.
 *
 * Category, budget and description travel together: they are one question
 * from the visitor's point of view, and splitting them across components
 * would mean threading the same draft and errors through twice.
 */
export function BudgetSelector({ draft, errors, onChange }: BudgetSelectorProps) {
  const t = useTranslations('booking.project')
  const categories = useTranslations('booking.categories')
  const budgets = useTranslations('booking.budgets')
  const messages = useTranslations('booking.errors')

  const errorFor = (field: keyof FieldErrors) => {
    const code = errors[field]
    return code ? messages(`${field}.${code}`) : undefined
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <SelectField
        label={t('category')}
        placeholder={t('categoryPlaceholder')}
        value={draft.category ?? ''}
        onChange={(event) =>
          onChange({ category: (event.target.value || null) as BookingDraft['category'] })
        }
        error={errorFor('category')}
        options={categoryIds.map((id) => ({ value: id, label: categories(id) }))}
      />

      <SelectField
        label={t('budget')}
        placeholder={t('budgetPlaceholder')}
        value={draft.budget ?? ''}
        onChange={(event) =>
          onChange({ budget: (event.target.value || null) as BookingDraft['budget'] })
        }
        error={errorFor('budget')}
        options={budgetIds.map((id) => ({ value: id, label: budgets(id) }))}
      />

      <TextAreaField
        label={t('description')}
        optional={t('optional')}
        placeholder={t('descriptionPlaceholder')}
        value={draft.description}
        onChange={(event) => onChange({ description: event.target.value })}
        className="sm:col-span-2"
      />
    </div>
  )
}
