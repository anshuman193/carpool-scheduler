export type Screen = 'home' | 'calendar' | 'groups' | 'chat' | 'menu'
export type ThemeMode = 'light' | 'dark'
export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export interface NavItem {
  key: Screen
  label: string
  path: `/${'' | Screen}`
  shortLabel: string
}

export interface UIState {
  currentScreen: Screen
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  theme: ThemeMode
}

export interface User {
  id: string
  name: string
  email: string
  picture?: string
  givenName?: string
  familyName?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
