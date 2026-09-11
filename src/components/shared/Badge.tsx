import type { PropsWithChildren } from 'react'

import { classNames } from '@utils/classNames'

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

interface BadgeProps extends PropsWithChildren {
  variant?: BadgeVariant
  className?: string
}

const badgeClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  primary: 'bg-brand/10 text-brand',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
}

export function Badge({ children, className, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide',
        badgeClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
