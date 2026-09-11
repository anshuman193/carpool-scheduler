import type { InputHTMLAttributes } from 'react'

import { classNames } from '@utils/classNames'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  helperText?: string
  error?: string
  successMessage?: string
}

export function Input({ className, error, helperText, id, label, successMessage, ...props }: InputProps) {
  const validationMessage = error ?? successMessage
  const validationClass = error
    ? 'border-danger focus:border-danger focus:ring-danger/20'
    : successMessage
      ? 'border-success focus:border-success focus:ring-success/20'
      : 'border-border focus:border-brand focus:ring-brand/20'

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-text" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        className={classNames(
          'w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text outline-none ring-4 ring-transparent transition placeholder:text-muted',
          validationClass,
          className,
        )}
        {...props}
      />
      {(helperText || validationMessage) && (
        <span className={classNames('text-xs', error ? 'text-danger' : successMessage ? 'text-success' : 'text-muted')}>
          {validationMessage ?? helperText}
        </span>
      )}
    </label>
  )
}
