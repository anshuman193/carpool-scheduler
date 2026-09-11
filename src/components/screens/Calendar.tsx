import { Badge } from '@components/shared/Badge'
import { Card } from '@components/shared/Card'

const events = [
  { day: 'Mon', duty: 'You drive', status: 'success' as const },
  { day: 'Wed', duty: 'Swap requested', status: 'warning' as const },
  { day: 'Fri', duty: 'Riya drives', status: 'primary' as const },
]

export function Calendar() {
  return (
    <Card title="Calendar" subtitle="Responsive scheduling surface for upcoming MVP features.">
      <div className="grid gap-3 tablet:grid-cols-3">
        {events.map((event) => (
          <div key={event.day} className="rounded-xl bg-surface-alt p-4">
            <p className="text-sm font-semibold text-text">{event.day}</p>
            <p className="mt-2 text-sm text-muted">{event.duty}</p>
            <Badge className="mt-3" variant={event.status}>
              Active
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}
