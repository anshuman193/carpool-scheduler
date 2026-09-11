import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import { classNames } from '@utils/classNames'

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: ButtonVariant
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand/90 focus-visible:outline-brand',
  secondary: 'bg-surface-alt text-text hover:bg-surface-alt/80 focus-visible:outline-slate-400',
  success: 'bg-success text-white hover:bg-success/90 focus-visible:outline-success',
  danger: 'bg-danger text-white hover:bg-danger/90 focus-visible:outline-danger',
}

export function Button({
  children,
  className,
  fullWidth = false,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames(
        'inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 tablet:px-5',
        fullWidth && 'w-full',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
