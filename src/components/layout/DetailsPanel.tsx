import type { Screen } from '@types/index'

import { Badge } from '@components/shared/Badge'
import { Card } from '@components/shared/Card'
import { SCREEN_TITLES } from '@utils/constants'

interface DetailsPanelProps {
  activeScreen: Screen
}

export function DetailsPanel({ activeScreen }: DetailsPanelProps) {
  return (
    <aside className="hidden w-80 desktop:block">
      <Card title="At a glance" subtitle="Desktop detail panel keeps key status visible.">
        <div className="space-y-4 text-sm text-muted">
          <div className="flex items-center justify-between">
            <span>Current workspace</span>
            <Badge variant="primary">{SCREEN_TITLES[activeScreen]}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Morning pickups</span>
            <Badge variant="success">4 scheduled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Messages needing reply</span>
            <Badge variant="warning">2 unread</Badge>
          </div>
        </div>
      </Card>
    </aside>
  )
}
