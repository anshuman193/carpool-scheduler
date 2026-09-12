import { useState } from 'react'

import { Button } from '@components/shared/Button'
import { useAppDispatch, useAppSelector } from '@store/index'
import { logout } from '@store/slices/authSlice'
import { LoginModal } from './LoginModal'

export function UserHeaderControl() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [showLoginModal, setShowLoginModal] = useState(false)

  if (!isAuthenticated || !user) {
    return (
      <>
        <Button onClick={() => setShowLoginModal(true)}>Sign in</Button>
        <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="h-8 w-8 rounded-full border border-border object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 font-semibold text-brand text-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden text-sm font-medium text-text tablet:inline">{user.name}</span>
      </div>
      <Button variant="secondary" onClick={() => dispatch(logout())}>
        Sign out
      </Button>
    </div>
  )
}
