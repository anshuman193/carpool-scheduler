import { Badge } from '@components/shared/Badge'
import { Button } from '@components/shared/Button'
import { Card } from '@components/shared/Card'

const groups = [
  { name: 'Lincoln Morning', members: 5, status: 'Stable' },
  { name: 'Soccer Shuttle', members: 4, status: 'Needs backup' },
]

export function Groups() {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <Card key={group.name} title={group.name} subtitle={`${group.members} families in the group`} actions={<Badge variant={group.status === 'Stable' ? 'success' : 'warning'}>{group.status}</Badge>}>
          <div className="flex flex-col gap-3 text-sm text-muted tablet:flex-row tablet:items-center tablet:justify-between">
            <p>Manage schedules, group roles, and future moderation tools from this shared card layout.</p>
            <Button variant="secondary">Open group</Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
