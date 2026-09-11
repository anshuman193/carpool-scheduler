import type { PropsWithChildren } from 'react'
import type { Screen, ThemeMode } from '@types/index'

import { DetailsPanel } from './DetailsPanel'
import { Navigation } from './Navigation/Navigation'
import { Sidebar } from './Navigation/Sidebar'

interface DesktopLayoutProps extends PropsWithChildren {
  activeScreen: Screen
  sidebarOpen: boolean
  theme: ThemeMode
  onNavigate: (screen: Screen) => void
  onToggleSidebar: () => void
  onToggleTheme: () => void
}

export function DesktopLayout({
  activeScreen,
  children,
  onNavigate,
  onToggleSidebar,
  onToggleTheme,
  sidebarOpen,
  theme,
}: DesktopLayoutProps) {
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
        <DetailsPanel activeScreen={activeScreen} />
      </div>
    </div>
  )
}
