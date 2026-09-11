import type { DeviceType } from '@types/index'
import { BREAKPOINTS } from '@styles/breakpoints'

export function detectDevice(width: number): DeviceType {
  if (width >= BREAKPOINTS.desktop) {
    return 'desktop'
  }

  if (width >= BREAKPOINTS.tablet) {
    return 'tablet'
  }

  return 'mobile'
}
