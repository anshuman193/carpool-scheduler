import type { PropsWithChildren } from 'react'
import type { Screen, ThemeMode } from '@types/index'

import { Navigation } from './Navigation/Navigation'

interface MobileLayoutProps extends PropsWithChildren {
  activeScreen: Screen
  theme: ThemeMode
  onNavigate: (screen: Screen) => void
  onToggleTheme: () => void
}

export function MobileLayout({ activeScreen, children, onNavigate, onToggleTheme, theme }: MobileLayoutProps) {
  return (
    <div className="min-h-screen pb-24">
      <header className="border-b border-border bg-canvas px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-brand">Carpool Scheduler</p>
            <p className="text-xs text-muted">Responsive mobile workspace</p>
          </div>
          <button type="button" onClick={onToggleTheme} className="text-sm font-medium text-muted">
            {theme === 'light' ? 'Dark' : 'Light'}
          </button>
        </div>
      </header>
      <main className="screen-container">{children}</main>
      <Navigation activeScreen={activeScreen} onNavigate={onNavigate} onToggleTheme={onToggleTheme} theme={theme} />
    </div>
  )
}
