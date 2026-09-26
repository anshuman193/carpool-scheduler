import { describe, expect, it } from 'vitest'

import { isDemoLoginEnabled, isLoginRequiredEverySession } from './authEnv'

describe('authEnv', () => {
  it('requires login every session by default in development', () => {
    expect(isLoginRequiredEverySession({ DEV: true })).toBe(true)
  })

  it('persists auth by default in production', () => {
    expect(isLoginRequiredEverySession({ DEV: false })).toBe(false)
  })

  it('allows env override for login persistence', () => {
    expect(isLoginRequiredEverySession({ DEV: true, VITE_REQUIRE_LOGIN_EVERYTIME: 'false' })).toBe(false)
    expect(isLoginRequiredEverySession({ DEV: false, VITE_REQUIRE_LOGIN_EVERYTIME: 'true' })).toBe(true)
  })

  it('enables demo login by default in development only', () => {
    expect(isDemoLoginEnabled({ DEV: true })).toBe(true)
    expect(isDemoLoginEnabled({ DEV: false })).toBe(false)
  })

  it('allows env override for demo login', () => {
    expect(isDemoLoginEnabled({ DEV: false, VITE_ENABLE_DEMO_LOGIN: 'true' })).toBe(true)
    expect(isDemoLoginEnabled({ DEV: true, VITE_ENABLE_DEMO_LOGIN: 'false' })).toBe(false)
  })
})
