import { Component, type ErrorInfo, type ReactNode, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import { LoginScreen } from '@components/auth/LoginScreen'
import { DesktopLayout } from '@components/layout/DesktopLayout'
import { MobileLayout } from '@components/layout/MobileLayout'
import { TabletLayout } from '@components/layout/TabletLayout'
import { Calendar } from '@components/screens/Calendar'
import { Chat } from '@components/screens/Chat'
import { Groups } from '@components/screens/Groups'
import { Home } from '@components/screens/Home'
import { Menu } from '@components/screens/Menu'
import { Modal } from '@components/shared/Modal'
import { useLayout } from '@hooks/useLayout'
import type { Screen } from '@types/index'
import { useAppDispatch, useAppSelector } from './store'
import { setCurrentScreen, setMobileMenuOpen, toggleSidebar, toggleTheme } from './store/slices/uiSlice'

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  public override state = { hasError: false }

  public static getDerivedStateFromError() {
    return { hasError: true }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App shell failed to render', error, errorInfo)
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <main className="screen-container items-center justify-center">
          <section className="surface-card max-w-lg p-6 text-center">
            <h1 className="text-xl font-semibold text-text">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted">Reload the app and try again. The error boundary keeps the shell from crashing entirely.</p>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

const screenComponents: Record<Screen, JSX.Element> = {
  home: <Home />,
  calendar: <Calendar />,
  groups: <Groups />,
  chat: <Chat />,
  menu: <Menu />,
}

function ScreenShell({ screen }: { screen: Screen }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isDesktop, isMobile } = useLayout()
  const { mobileMenuOpen, sidebarOpen, theme } = useAppSelector((state) => state.ui)
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    dispatch(setCurrentScreen(screen))
    dispatch(setMobileMenuOpen(false))
  }, [dispatch, location.pathname, screen])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const handleNavigate = (nextScreen: Screen) => {
    navigate(nextScreen === 'home' ? '/' : `/${nextScreen}`)
  }

  const content = useMemo(() => screenComponents[screen], [screen])

  const layoutProps = {
    activeScreen: screen,
    onNavigate: handleNavigate,
    onToggleTheme: () => dispatch(toggleTheme()),
    sidebarOpen,
    theme,
  }

  return (
    <>
      {isMobile ? (
        <MobileLayout {...layoutProps}>{content}</MobileLayout>
      ) : isDesktop ? (
        <DesktopLayout {...layoutProps} onToggleSidebar={() => dispatch(toggleSidebar())}>
          {content}
        </DesktopLayout>
      ) : (
        <TabletLayout {...layoutProps} onToggleSidebar={() => dispatch(toggleSidebar())}>
          {content}
        </TabletLayout>
      )}
      <Modal
        open={showWelcome && screen === 'home' && isMobile}
        title="Welcome to the MVP shell"
        onClose={() => setShowWelcome(false)}
      >
        <p className="text-sm text-muted">
          This starter includes responsive layouts, typed state management, dark mode, and shared UI primitives so authentication, calendar, groups, and chat features can be added without restructuring the app.
        </p>
      </Modal>
      <Modal
        open={mobileMenuOpen && !isMobile}
        title="Workspace status"
        onClose={() => dispatch(setMobileMenuOpen(false))}
      >
        <p className="text-sm text-muted">The global UI slice already supports modal and menu state for future overflow navigation and command palettes.</p>
      </Modal>
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ScreenShell screen="home" />} />
      <Route path="/calendar" element={<ScreenShell screen="calendar" />} />
      <Route path="/groups" element={<ScreenShell screen="groups" />} />
      <Route path="/chat" element={<ScreenShell screen="chat" />} />
      <Route path="/menu" element={<ScreenShell screen="menu" />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { theme } = useAppSelector((state) => state.ui)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <ErrorBoundary>
      {isAuthenticated ? <AppRoutes /> : <LoginScreen />}
    </ErrorBoundary>
  )
}
