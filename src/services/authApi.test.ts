import { afterEach, describe, expect, it, vi } from 'vitest'

import { getSession, refreshSession, verifyGoogleIdToken } from './authApi'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

afterEach(() => {
  mockFetch.mockReset()
})

describe('authApi contracts', () => {
  it('posts google token for verification', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: 'u1', name: 'A', email: 'a@example.com' }, session: { accessToken: 'tok', tokenType: 'Bearer', expiresIn: 900 } }),
    })

    const response = await verifyGoogleIdToken('google-token')

    expect(response.session.accessToken).toBe('tok')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/google/verify'),
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('requests active session by bearer token', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: 'u1', name: 'A', email: 'a@example.com' }, session: { accessToken: 'tok', tokenType: 'Bearer', expiresIn: 900 } }),
    })

    await getSession('abc')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/session'),
      expect.objectContaining({
        headers: expect.objectContaining({
          authorization: expect.stringContaining('earer'),
        }),
      }),
    )
  })

  it('refreshes backend session tokens', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: 'u1', name: 'A', email: 'a@example.com' }, session: { accessToken: 'tok2', refreshToken: 'rt2', tokenType: 'Bearer', expiresIn: 900, refreshExpiresIn: 86400 } }),
    })

    const refreshed = await refreshSession('refresh-token')

    expect(refreshed.session.refreshToken).toBe('rt2')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/session/refresh'),
      expect.objectContaining({ method: 'POST' }),
    )
  })
})
