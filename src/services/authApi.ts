import type { User } from '@types/index'

import { apiRequest } from './apiClient'

interface SessionPayload {
  accessToken: string
  refreshToken?: string
  tokenType: 'Bearer'
  expiresIn: number
  refreshExpiresIn?: number
}

interface AuthResponse {
  user: User
  session: SessionPayload
}

export async function verifyGoogleIdToken(idToken: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/google/verify', {
    method: 'POST',
    body: { idToken },
  })
}

export async function getSession(token: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/session', {
    method: 'GET',
    token,
  })
}

export async function refreshSession(refreshToken: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/session/refresh', {
    method: 'POST',
    body: { refreshToken },
  })
}

export async function logoutSession(token: string | null, refreshToken: string | null): Promise<void> {
  await apiRequest<{ success: boolean }>('/auth/logout', {
    method: 'POST',
    token,
    body: { refreshToken },
  })
}
