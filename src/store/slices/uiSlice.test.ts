import { describe, expect, it } from 'vitest'

import reducer, {
  setCurrentScreen,
  setMobileMenuOpen,
  setSidebarOpen,
  setTheme,
  toggleMobileMenu,
  toggleSidebar,
  toggleTheme,
} from './uiSlice'

describe('uiSlice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      currentScreen: 'home',
      sidebarOpen: true,
      mobileMenuOpen: false,
      theme: 'light',
    })
  })

  it('updates explicit state values', () => {
    let state = reducer(undefined, setCurrentScreen('chat'))
    state = reducer(state, setSidebarOpen(false))
    state = reducer(state, setMobileMenuOpen(true))
    state = reducer(state, setTheme('dark'))

    expect(state).toEqual({
      currentScreen: 'chat',
      sidebarOpen: false,
      mobileMenuOpen: true,
      theme: 'dark',
    })
  })

  it('toggles boolean UI state', () => {
    let state = reducer(undefined, toggleSidebar())
    state = reducer(state, toggleMobileMenu())
    state = reducer(state, toggleTheme())

    expect(state.sidebarOpen).toBe(false)
    expect(state.mobileMenuOpen).toBe(true)
    expect(state.theme).toBe('dark')
  })
})
