import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

import { Button } from '@components/shared/Button'
import { Card } from '@components/shared/Card'
import { useAppDispatch, useAppSelector } from '@store/index'
import { setError, setLoading, setCredentials } from '@store/slices/authSlice'
import { toggleTheme } from '@store/slices/uiSlice'
import type { User } from '@types/index'
import { APP_NAME } from '@utils/constants'

interface GoogleDecodedToken {
  sub: string
  name: string
  email: string
  picture?: string
  given_name?: string
  family_name?: string
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const IS_DEV_LOGIN_EVERYTIME =
  import.meta.env.VITE_REQUIRE_LOGIN_EVERYTIME === 'true' ||
  (import.meta.env.DEV && import.meta.env.VITE_REQUIRE_LOGIN_EVERYTIME !== 'false')

export function LoginScreen() {
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const { theme } = useAppSelector((state) => state.ui)

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
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <Button variant="secondary" onClick={() => dispatch(toggleTheme())}>
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </Button>
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white font-bold text-xl shadow-md">
            CS
          </div>
          <h1 className="text-2xl font-bold text-text">{APP_NAME}</h1>
          <p className="text-sm text-muted">
            Family carpool scheduling & ride coordination made simple.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <Card title="Sign In Required" subtitle="Please authenticate with Google to access your dashboard.">
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
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
              <p className="text-xs text-muted mb-3">Instant Local Development Login</p>
              <Button
                variant="primary"
                onClick={handleMockLogin}
                disabled={isLoading}
                className="w-full justify-center"
              >
                {isLoading ? 'Signing in...' : 'Sign in with Google Demo Account'}
              </Button>
            </div>
          </div>
        </Card>

        {IS_DEV_LOGIN_EVERYTIME && (
          <div className="rounded-lg bg-surface-alt p-3 text-center text-xs text-muted">
            <span className="font-semibold text-brand">Dev Mode Active:</span> Login is required every session (`VITE_REQUIRE_LOGIN_EVERYTIME=true`).
          </div>
        )}
      </div>
    </div>
  )
}
