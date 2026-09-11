import { createContext, useContext, useMemo, type PropsWithChildren } from 'react'

import { useResponsive } from './useResponsive'

interface LayoutContextValue {
  device: ReturnType<typeof useResponsive>['device']
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  showSidebar: boolean
  showDetailsPanel: boolean
}

const LayoutContext = createContext<LayoutContextValue | null>(null)

export function LayoutProvider({ children }: PropsWithChildren) {
  const responsive = useResponsive()

  const value = useMemo<LayoutContextValue>(
    () => ({
      device: responsive.device,
      isMobile: responsive.isMobile,
      isTablet: responsive.isTablet,
      isDesktop: responsive.isDesktop,
      showSidebar: responsive.isTabletUp,
      showDetailsPanel: responsive.isDesktop,
    }),
    [responsive.device, responsive.isDesktop, responsive.isMobile, responsive.isTablet, responsive.isTabletUp],
  )

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

export function useLayout() {
  const context = useContext(LayoutContext)

  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }

  return context
}
