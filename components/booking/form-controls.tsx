'use client'

import { ChevronDown } from 'lucide-react'
import { useId, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes, type InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

/**
 * Form primitives for the booking flow.
 *
 * Every control routes through here so height, radius, focus ring and error
 * treatment are declared once. Each renders a real `<label>` bound by id, and
 * wires `aria-invalid` / `aria-describedby` from a single `error` prop — the
 * accessible state cannot drift from the visual one because both read the
 * same value.
 */

const controlBase = cn(
  'w-full rounded-[10px] border bg-white px-3.5 text-[0.9375rem] text-ink',
  'transition-colors duration-200 outline-none',
  'placeholder:text-ink-subtle',
)

function stateClasses(hasError: boolean) {
  return hasError ? 'border-destructive' : 'border-line focus:border-brand'
}

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  errorId?: string
  optional?: string
  children: ReactNode
  className?: string
}

function Field({ label, htmlFor, error, errorId, optional, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className="text-[0.8125rem] font-medium text-ink">
        {label}
        {optional ? (
          <span className="ml-1.5 font-normal text-ink-subtle">{optional}</span>
        ) : null}
      </label>

      {children}

      {error ? (
        <p id={errorId} role="alert" className="text-[0.8125rem] text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/* ---------------------------------------------------------------- Text input */

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'> {
  label: string
  error?: string
  optional?: string
  className?: string
}

export function TextField({ label, error, optional, className, ...input }: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <Field
      label={label}
      htmlFor={id}
      error={error}
      errorId={errorId}
      optional={optional}
      className={className}
    >
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(controlBase, stateClasses(Boolean(error)), 'h-11')}
        {...input}
      />
    </Field>
  )
}

/* -------------------------------------------------------------------- Select */

interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'id'> {
  label: string
  error?: string
  optional?: string
  className?: string
  placeholder: string
  options: Array<{ value: string; label: string }>
}

export function SelectField({
  label,
  error,
  optional,
  className,
  placeholder,
  options,
  value,
  ...select
}: SelectFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <Field
      label={label}
      htmlFor={id}
      error={error}
      errorId={errorId}
      optional={optional}
      className={className}
    >
      {/* A native select, not a custom listbox: it gets the platform picker on
          mobile, full keyboard support, and needs no focus management. */}
      <div className="relative">
        <select
          id={id}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            controlBase,
            stateClasses(Boolean(error)),
            'h-11 cursor-pointer appearance-none pr-10',
            !value && 'text-ink-subtle',
          )}
          {...select}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-ink">
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-subtle"
        />
      </div>
    </Field>
  )
}

/* ------------------------------------------------------------------ Textarea */

interface TextAreaFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'id'> {
  label: string
  error?: string
  optional?: string
  className?: string
}

export function TextAreaField({
  label,
  error,
  optional,
  className,
  ...textarea
}: TextAreaFieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <Field
      label={label}
      htmlFor={id}
      error={error}
      errorId={errorId}
      optional={optional}
      className={className}
    >
      <textarea
        id={id}
        rows={5}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(controlBase, stateClasses(Boolean(error)), 'resize-y py-3 leading-relaxed')}
        {...textarea}
      />
    </Field>
  )
}
