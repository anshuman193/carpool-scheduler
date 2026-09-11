import type { Screen } from '@types/index'
import { NAV_ITEMS } from '@utils/constants'
import { classNames } from '@utils/classNames'

interface BottomTabNavProps {
  activeScreen: Screen
  onNavigate: (screen: Screen) => void
}

export function BottomTabNav({ activeScreen, onNavigate }: BottomTabNavProps) {
  return (
    <nav className="surface-card fixed inset-x-4 bottom-4 z-30 grid grid-cols-5 gap-1 rounded-2xl p-2 tablet:hidden" aria-label="Mobile navigation">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onNavigate(item.key)}
          className={classNames(
            'rounded-xl px-2 py-3 text-center text-xs font-medium transition',
            activeScreen === item.key ? 'bg-brand text-white' : 'text-muted hover:bg-surface-alt',
          )}
        >
          {item.shortLabel}
        </button>
      ))}
    </nav>
  )
}
