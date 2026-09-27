import { config } from '../config.js'
import { createId, createOpaqueToken } from './tokenService.js'

const nowSeconds = () => Math.floor(Date.now() / 1000)

async function verifyWithGoogle(idToken) {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`)
  if (!response.ok) {
    throw new Error('Google token verification failed')
  }

  const payload = await response.json()
  if (!payload.sub || !payload.email) {
    throw new Error('Google token payload is incomplete')
  }
  if (config.googleClientId && payload.aud !== config.googleClientId) {
    throw new Error('Google token audience does not match configured client id')
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.email,
    picture: payload.picture,
    given_name: payload.given_name,
    family_name: payload.family_name,
  }
}

export async function verifyGoogleToken(idToken) {
  if (config.allowDemoIdToken && idToken === 'demo-google-token') {
    return {
      sub: 'usr_demo_owner',
      email: 'anshuman.demo@gmail.com',
      name: 'Anshuman Demo',
      picture: 'https://lh3.googleusercontent.com/a/default-user',
      given_name: 'Anshuman',
      family_name: 'Demo',
    }
  }

  return verifyWithGoogle(idToken)
}

export function upsertUserFromGoogleClaims(store, claims) {
  const existing = [...store.users.values()].find((user) => user.email === claims.email)
  if (existing) {
    const updated = {
      ...existing,
      name: claims.name,
      picture: claims.picture,
      givenName: claims.given_name,
      familyName: claims.family_name,
    }
    store.users.set(updated.id, updated)
    return updated
  }

  const user = {
    id: claims.sub ? `usr_${claims.sub}` : createId('usr'),
    email: claims.email,
    name: claims.name,
    picture: claims.picture,
    givenName: claims.given_name,
    familyName: claims.family_name,
    isAdmin: false,
    createdAt: new Date().toISOString(),
  }

  store.users.set(user.id, user)
  return user
}

export function createSession(store, userId) {
  const accessToken = createOpaqueToken()
  const refreshToken = createOpaqueToken()
  const issuedAt = nowSeconds()
  const accessExpiresAt = issuedAt + config.accessTokenTtlSeconds
  const refreshExpiresAt = issuedAt + config.refreshTokenTtlSeconds

  const session = {
    userId,
    accessToken,
    refreshToken,
    accessExpiresAt,
    refreshExpiresAt,
    createdAt: new Date().toISOString(),
  }

  store.accessSessions.set(accessToken, session)
  store.refreshSessions.set(refreshToken, session)

  return session
}

export function readAccessSession(store, accessToken) {
  if (!accessToken) return null
  const session = store.accessSessions.get(accessToken)
  if (!session) return null

  if (session.accessExpiresAt <= nowSeconds()) {
    store.accessSessions.delete(accessToken)
    return null
  }

  return session
}

export function rotateRefreshSession(store, refreshToken) {
  const existing = store.refreshSessions.get(refreshToken)
  if (!existing) return null

  if (existing.refreshExpiresAt <= nowSeconds()) {
    store.refreshSessions.delete(refreshToken)
    store.accessSessions.delete(existing.accessToken)
    return null
  }

  store.refreshSessions.delete(existing.refreshToken)
  store.accessSessions.delete(existing.accessToken)
  return createSession(store, existing.userId)
}

export function revokeSession(store, { accessToken, refreshToken }) {
  if (accessToken) {
    const session = store.accessSessions.get(accessToken)
    if (session) {
      store.refreshSessions.delete(session.refreshToken)
    }
    store.accessSessions.delete(accessToken)
  }

  if (refreshToken) {
    const session = store.refreshSessions.get(refreshToken)
    if (session) {
      store.accessSessions.delete(session.accessToken)
    }
    store.refreshSessions.delete(refreshToken)
  }
}
