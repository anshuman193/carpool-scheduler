import type { Screen } from '@types/index'
import { NAV_ITEMS } from '@utils/constants'
import { classNames } from '@utils/classNames'

interface SidebarProps {
  activeScreen: Screen
  open: boolean
  onNavigate: (screen: Screen) => void
}

export function Sidebar({ activeScreen, onNavigate, open }: SidebarProps) {
  return (
    <aside className={classNames('surface-card hidden h-fit min-h-[calc(100vh-8rem)] w-64 p-4 tablet:block', !open && 'tablet:w-24')}>
      <nav aria-label="Sidebar navigation" className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            className={classNames(
              'rounded-xl px-3 py-3 text-left text-sm font-medium transition',
              activeScreen === item.key ? 'bg-brand text-white' : 'text-muted hover:bg-surface-alt hover:text-text',
            )}
          >
            {open ? item.label : item.label.slice(0, 1)}
          </button>
        ))}
      </nav>
    </aside>
  )
}
