interface AuthEnv {
  DEV: boolean
  VITE_ENABLE_DEMO_LOGIN?: string
  VITE_REQUIRE_LOGIN_EVERYTIME?: string
}

export function isLoginRequiredEverySession(env: AuthEnv = import.meta.env): boolean {
  if (env.VITE_REQUIRE_LOGIN_EVERYTIME === 'true') return true
  if (env.VITE_REQUIRE_LOGIN_EVERYTIME === 'false') return false

  return env.DEV
}

export function isDemoLoginEnabled(env: AuthEnv = import.meta.env): boolean {
  if (env.VITE_ENABLE_DEMO_LOGIN === 'true') return true
  if (env.VITE_ENABLE_DEMO_LOGIN === 'false') return false

  return env.DEV
}
