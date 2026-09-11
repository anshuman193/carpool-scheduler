import type { DeviceType } from '@types/index'
import { MEDIA_QUERIES } from '@styles/breakpoints'
import { detectDevice } from '@utils/deviceDetect'

import { useMediaQuery } from './useMediaQuery'

export function useResponsive() {
  const isTabletUp = useMediaQuery(MEDIA_QUERIES.tablet)
  const isDesktop = useMediaQuery(MEDIA_QUERIES.desktop)

  let device: DeviceType = 'mobile'

  if (typeof window !== 'undefined') {
    device = detectDevice(window.innerWidth)
  } else if (isDesktop) {
    device = 'desktop'
  } else if (isTabletUp) {
    device = 'tablet'
  }

  return {
    device,
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
    isTabletUp,
  }
}
