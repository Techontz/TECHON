import type { ComponentProps, ReactNode } from 'react'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

/** Radius steps with size, but never past the 14px ceiling. */
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[0.875rem] rounded-full gap-1.5',
  md: 'h-11 px-5 text-[0.9375rem] rounded-full gap-2',
  lg: 'h-[3.25rem] px-7 text-[1rem] rounded-full gap-2',
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-deep active:bg-brand-deep',
  secondary:
    'bg-white text-ink border border-line hover:border-line-strong hover:bg-surface active:bg-surface',
  quiet: 'text-ink hover:text-brand px-0 h-auto',
}

const base = cn(
  'group/btn inline-flex select-none items-center justify-center whitespace-nowrap font-medium',
  'transition-[background-color,border-color,color,transform] duration-200 ease-out',
  'active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40',
)

interface StyleProps {
  variant?: Variant
  size?: Size
  className?: string
  /** Trailing icon — nudges 2px on hover, nothing more. */
  icon?: ReactNode
}

type ActionLinkProps = StyleProps &
  Omit<ComponentProps<typeof Link>, 'className'> & {
    /** Adds `target="_blank"` and the matching `rel`. */
    external?: boolean
  }

type ActionButtonProps = StyleProps & Omit<ComponentProps<'button'>, 'className'>

function Content({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <>
      {children}
      {icon ? (
        <span className="transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5">
          {icon}
        </span>
      ) : null}
    </>
  )
}

/**
 * Navigational call to action.
 *
 * Renders a real anchor through next-intl's `Link`, so it keeps the active
 * locale, middle-clicks, and announces as a link rather than a control.
 */
export function ActionLink({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon,
  external,
  ...linkProps
}: ActionLinkProps) {
  return (
    <Link
      className={cn(base, sizes[size], variants[variant], className)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...linkProps}
    >
      <Content icon={icon}>{children}</Content>
    </Link>
  )
}

/** Same styling, for controls that act rather than navigate. */
export function ActionButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon,
  ...buttonProps
}: ActionButtonProps) {
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...buttonProps}>
      <Content icon={icon}>{children}</Content>
    </button>
  )
}
