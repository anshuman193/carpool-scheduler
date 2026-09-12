import { useState, type ReactNode } from 'react'

import { Button } from '@components/shared/Button'
import { Card } from '@components/shared/Card'
import { useAppSelector } from '@store/index'
import { LoginModal } from './LoginModal'

interface ProtectedRouteProps {
  children: ReactNode
  title?: string
}

export function ProtectedRoute({ children, title = 'Authentication required' }: ProtectedRouteProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [showModal, setShowModal] = useState(false)

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 py-8 px-4 text-center">
      <Card title={title} subtitle="You must be signed in with Google to view this page.">
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <p className="text-sm text-muted">
            Sign in with Google to manage schedules, view carpool groups, and coordinate drop-offs.
          </p>
          <Button onClick={() => setShowModal(true)}>Sign in with Google</Button>
        </div>
      </Card>
      <LoginModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
