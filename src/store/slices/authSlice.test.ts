import { describe, expect, it } from 'vitest'

import reducer, {
  logout,
  setCredentials,
  setError,
  setLoading,
} from './authSlice'

describe('authSlice', () => {
  it('returns the initial state', () => {
    const initialState = reducer(undefined, { type: 'unknown' })
    expect(initialState.user).toBeNull()
    expect(initialState.token).toBeNull()
    expect(initialState.isAuthenticated).toBe(false)
    expect(initialState.isLoading).toBe(false)
    expect(initialState.error).toBeNull()
  })

  it('sets user credentials on setCredentials', () => {
    const user = {
      id: '12345',
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://example.com/avatar.jpg',
    }
    const token = 'mock-jwt-token'

    const state = reducer(undefined, setCredentials({ user, token }))

    expect(state.user).toEqual(user)
    expect(state.token).toBe(token)
    expect(state.isAuthenticated).toBe(true)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('clears user credentials on logout', () => {
    const user = {
      id: '12345',
      name: 'Test User',
      email: 'test@example.com',
    }
    const token = 'mock-jwt-token'

    let state = reducer(undefined, setCredentials({ user, token }))
    expect(state.isAuthenticated).toBe(true)

    state = reducer(state, logout())
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('handles loading and error state', () => {
    let state = reducer(undefined, setLoading(true))
    expect(state.isLoading).toBe(true)

    state = reducer(state, setError('Auth error'))
    expect(state.isLoading).toBe(false)
    expect(state.error).toBe('Auth error')
  })
})
