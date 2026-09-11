import type { PropsWithChildren } from 'react'
import type { Screen, ThemeMode } from '@types/index'

import { Navigation } from './Navigation/Navigation'
import { Sidebar } from './Navigation/Sidebar'

interface TabletLayoutProps extends PropsWithChildren {
  activeScreen: Screen
  sidebarOpen: boolean
  theme: ThemeMode
  onNavigate: (screen: Screen) => void
  onToggleSidebar: () => void
  onToggleTheme: () => void
}

export function TabletLayout({
  activeScreen,
  children,
  onNavigate,
  onToggleSidebar,
  onToggleTheme,
  sidebarOpen,
  theme,
}: TabletLayoutProps) {
  return (
    <div className="min-h-screen">
      <Navigation
        activeScreen={activeScreen}
        onNavigate={onNavigate}
        onToggleSidebar={onToggleSidebar}
        onToggleTheme={onToggleTheme}
        theme={theme}
      />
      <div className="screen-container flex-row items-start">
        <Sidebar activeScreen={activeScreen} onNavigate={onNavigate} open={sidebarOpen} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
