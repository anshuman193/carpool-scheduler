import type { Screen, ThemeMode } from '@types/index'

import { useLayout } from '@hooks/useLayout'

import { BottomTabNav } from './BottomTabNav'
import { TopHeader } from './TopHeader'

interface NavigationProps {
  activeScreen: Screen
  theme: ThemeMode
  onNavigate: (screen: Screen) => void
  onToggleSidebar?: () => void
  onToggleTheme: () => void
}

export function Navigation({ activeScreen, onNavigate, onToggleSidebar, onToggleTheme, theme }: NavigationProps) {
  const { isMobile } = useLayout()

  return (
    <>
      {!isMobile && (
        <TopHeader
          activeScreen={activeScreen}
          onToggleSidebar={onToggleSidebar}
          onToggleTheme={onToggleTheme}
          theme={theme}
        />
      )}
      {isMobile && <BottomTabNav activeScreen={activeScreen} onNavigate={onNavigate} />}
    </>
  )
}
