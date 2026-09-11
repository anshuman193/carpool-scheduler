import { useEffect, type PropsWithChildren, type ReactNode } from 'react'

import { useResponsive } from '@hooks/useResponsive'
import { classNames } from '@utils/classNames'

import { Button } from './Button'

interface ModalProps extends PropsWithChildren {
  open: boolean
  title: string
  onClose: () => void
  footer?: ReactNode
}

export function Modal({ children, footer, onClose, open, title }: ModalProps) {
  const { isMobile } = useResponsive()

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 desktop:items-center" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div
        className={classNames(
          'surface-card w-full max-w-2xl overflow-hidden',
          isMobile ? 'rounded-b-none safe-bottom' : 'desktop:rounded-xl',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4 tablet:px-6">
          <h2 id="modal-title" className="text-lg font-semibold text-text">
            {title}
          </h2>
          <Button aria-label="Close modal" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-4 py-4 tablet:px-6">{children}</div>
        {footer && <div className="border-t border-border px-4 py-4 tablet:px-6">{footer}</div>}
      </div>
    </div>
  )
}
