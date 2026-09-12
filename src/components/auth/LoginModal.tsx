import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

import { Button } from '@components/shared/Button'
import { Card } from '@components/shared/Card'
import { Modal } from '@components/shared/Modal'
import { useAppDispatch, useAppSelector } from '@store/index'
import { setError, setLoading, setCredentials } from '@store/slices/authSlice'
import type { User } from '@types/index'

interface GoogleDecodedToken {
  sub: string
  name: string
  email: string
  picture?: string
  given_name?: string
  family_name?: string
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

interface LoginModalProps {
  open: boolean
  onClose?: () => void
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    try {
      dispatch(setLoading(true))
      if (!credentialResponse.credential) {
        dispatch(setError('No Google credential returned'))
        return
      }

      const decoded = jwtDecode<GoogleDecodedToken>(credentialResponse.credential)
      const user: User = {
        id: decoded.sub,
        name: decoded.name || 'Google User',
        email: decoded.email,
        picture: decoded.picture,
        givenName: decoded.given_name,
        familyName: decoded.family_name,
      }

      dispatch(setCredentials({ user, token: credentialResponse.credential }))
      if (onClose) onClose()
    } catch (err) {
      console.error('Failed to decode Google token', err)
      dispatch(setError('Authentication failed. Please try again.'))
    }
  }

  const handleGoogleError = () => {
    dispatch(setError('Google sign-in was unsuccessful. Please try again.'))
  }

  const handleMockLogin = () => {
    dispatch(setLoading(true))
    const mockUser: User = {
      id: 'google_mock_109283741',
      name: 'Anshuman (Google Demo)',
      email: 'anshuman.demo@gmail.com',
      picture: 'https://lh3.googleusercontent.com/a/default-user',
      givenName: 'Anshuman',
      familyName: 'Demo',
    }
    dispatch(setCredentials({ user: mockUser, token: 'mock_google_id_token_12345' }))
    if (onClose) onClose()
  }

  return (
    <Modal open={open} title="Sign in to Carpool Scheduler" onClose={onClose}>
      <div className="space-y-4 py-2">
        <p className="text-sm text-muted">
          Sign in with your Google account to access your family carpool schedules, chat with drivers, and manage group pickups.
        </p>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
            {error}
          </div>
        )}

        <Card title="Google Authentication">
          <div className="flex flex-col items-center justify-center space-y-4 py-3">
            {CLIENT_ID ? (
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>
            ) : (
              <div className="text-xs text-muted text-center italic mb-1">
                (Google Client ID not set in environment. Use Demo Sign-In below)
              </div>
            )}

            <div className="w-full border-t border-border pt-4 text-center">
              <p className="text-xs text-muted mb-2">Want to try without a Google Client ID?</p>
              <Button
                variant="secondary"
                onClick={handleMockLogin}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in with Demo Google Account'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Modal>
  )
}
