import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'

import { Button } from '@components/shared/Button'
import { Card } from '@components/shared/Card'
import { Modal } from '@components/shared/Modal'
import { verifyGoogleIdToken } from '@services/authApi'
import { useAppDispatch, useAppSelector } from '@store/index'
import { setError, setLoading, setCredentials } from '@store/slices/authSlice'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

interface LoginModalProps {
  open: boolean
  onClose?: () => void
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    dispatch(setLoading(true))
    if (!credentialResponse.credential) {
      dispatch(setError('No Google credential returned'))
      return
    }

    try {
      const response = await verifyGoogleIdToken(credentialResponse.credential)
      dispatch(
        setCredentials({
          user: response.user,
          token: response.session.accessToken,
          refreshToken: response.session.refreshToken,
        }),
      )
      if (onClose) onClose()
    } catch (err) {
      console.error('Failed to verify Google token with backend', err)
      dispatch(setError('Authentication failed. Please try again.'))
    }
  }

  const handleGoogleError = () => {
    dispatch(setError('Google sign-in was unsuccessful. Please try again.'))
  }

  const handleDemoLogin = async () => {
    dispatch(setLoading(true))
    try {
      const response = await verifyGoogleIdToken('demo-google-token')
      dispatch(
        setCredentials({
          user: response.user,
          token: response.session.accessToken,
          refreshToken: response.session.refreshToken,
        }),
      )
      if (onClose) onClose()
    } catch (err) {
      console.error('Failed demo backend login', err)
      dispatch(setError('Demo login failed. Configure backend demo token support.'))
    }
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
                onClick={handleDemoLogin}
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
