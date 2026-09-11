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
