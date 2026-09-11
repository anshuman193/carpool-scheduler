import type { NavItem, Screen } from '@types/index'

export const APP_NAME = 'Carpool Scheduler'

export const SCREEN_TITLES: Record<Screen, string> = {
  home: 'Home',
  calendar: 'Calendar',
  groups: 'Groups',
  chat: 'Chat',
  menu: 'Menu',
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', shortLabel: 'Home', path: '/' },
  { key: 'calendar', label: 'Calendar', shortLabel: 'Cal', path: '/calendar' },
  { key: 'groups', label: 'Groups', shortLabel: 'Groups', path: '/groups' },
  { key: 'chat', label: 'Chat', shortLabel: 'Chat', path: '/chat' },
  { key: 'menu', label: 'Menu', shortLabel: 'Menu', path: '/menu' },
]
