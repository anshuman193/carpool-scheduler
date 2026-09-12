import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { AuthState, User } from '@types/index'

const AUTH_STORAGE_KEY = 'carpool_auth_state'

const shouldRequireLoginEverytime = (): boolean => {
  const envVal = import.meta.env.VITE_REQUIRE_LOGIN_EVERYTIME
  if (envVal === 'true') return true
  if (envVal === 'false') return false
  // Default behavior: require fresh login on start in development mode, persist in production
  return import.meta.env.DEV
}

const loadSavedAuth = (): { user: User; token: string } | null => {
  if (shouldRequireLoginEverytime()) {
    return null
  }

  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed?.user && parsed?.token) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Failed to parse saved auth state', err)
  }
  return null
}

const savedAuth = typeof window !== 'undefined' ? loadSavedAuth() : null

const initialState: AuthState = {
  user: savedAuth?.user || null,
  token: savedAuth?.token || null,
  isAuthenticated: Boolean(savedAuth?.user),
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload))
      } catch (err) {
        console.error('Failed to save auth state to localStorage', err)
      }
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      } catch (err) {
        console.error('Failed to remove auth state from localStorage', err)
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const { setCredentials, logout, setLoading, setError } = authSlice.actions

export default authSlice.reducer
