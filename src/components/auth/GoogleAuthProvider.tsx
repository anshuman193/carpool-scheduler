import type { ReactNode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

interface GoogleAuthProviderProps {
  children: ReactNode
}

export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  if (!CLIENT_ID) {
    // If no Google Client ID is configured, render children directly.
    return <>{children}</>
  }

  return <GoogleOAuthProvider clientId={CLIENT_ID}>{children}</GoogleOAuthProvider>
}
