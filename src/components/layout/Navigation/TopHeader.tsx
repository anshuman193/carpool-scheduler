import type { Screen, ThemeMode } from '@types/index'
import { APP_NAME, SCREEN_TITLES } from '@utils/constants'

import { UserHeaderControl } from '@components/auth/UserHeaderControl'
import { Button } from '@components/shared/Button'

interface TopHeaderProps {
  activeScreen: Screen
  theme: ThemeMode
  onToggleTheme: () => void
  onToggleSidebar?: () => void
}

export function TopHeader({ activeScreen, onToggleSidebar, onToggleTheme, theme }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 tablet:px-6 desktop:px-8">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <Button variant="secondary" onClick={onToggleSidebar}>
              Menu
            </Button>
          )}
          <div>
            <p className="text-sm font-semibold text-brand">{APP_NAME}</p>
            <h1 className="text-xl font-semibold text-text">{SCREEN_TITLES[activeScreen]}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserHeaderControl />
          <Button variant="secondary" onClick={onToggleTheme}>
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </Button>
        </div>
      </div>
    </header>
  )
}
