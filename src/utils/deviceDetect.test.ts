import { describe, expect, it } from 'vitest'

import { BREAKPOINTS } from '@styles/breakpoints'

import { detectDevice } from './deviceDetect'

describe('detectDevice', () => {
  it('returns mobile below the tablet breakpoint', () => {
    expect(detectDevice(BREAKPOINTS.tablet - 1)).toBe('mobile')
  })

  it('returns tablet from the tablet breakpoint until desktop', () => {
    expect(detectDevice(BREAKPOINTS.tablet)).toBe('tablet')
    expect(detectDevice(BREAKPOINTS.desktop - 1)).toBe('tablet')
  })

  it('returns desktop at and above the desktop breakpoint', () => {
    expect(detectDevice(BREAKPOINTS.desktop)).toBe('desktop')
    expect(detectDevice(BREAKPOINTS.desktop + 400)).toBe('desktop')
  })
})
