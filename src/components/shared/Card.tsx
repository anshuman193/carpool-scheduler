import type { PropsWithChildren, ReactNode } from 'react'

import { classNames } from '@utils/classNames'

interface CardProps extends PropsWithChildren {
  title?: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

export function Card({ actions, children, className, subtitle, title }: CardProps) {
  return (
    <section className={classNames('surface-card p-4 tablet:p-5 desktop:p-6', className)}>
      {(title || subtitle || actions) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-lg font-semibold text-text">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  )
}
