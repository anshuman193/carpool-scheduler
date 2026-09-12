import { Badge } from '@components/shared/Badge'
import { Button } from '@components/shared/Button'
import { Card } from '@components/shared/Card'
import { useAppSelector } from '@store/index'

export function Home() {
  const { user } = useAppSelector((state) => state.auth)
  const greetingName = user ? user.givenName || user.name.split(' ')[0] : 'Driver'

  return (
    <div className="space-y-4">
      <Card
        title={`Good morning, ${greetingName}`}
        subtitle="Today’s carpool status stays prominent across every screen size."
        actions={<Badge variant="success">Your turn</Badge>}
      >
        <div className="grid gap-3 text-sm text-muted tablet:grid-cols-2">
          <div className="rounded-xl bg-surface-alt p-4">
            <p className="font-semibold text-text">Next pickup</p>
            <p>Lincoln Elementary · 7:30 AM</p>
          </div>
          <div className="rounded-xl bg-surface-alt p-4">
            <p className="font-semibold text-text">Passengers</p>
            <p>3 children · 2 drop-offs</p>
          </div>
        </div>
      </Card>
      <div className="grid gap-4 desktop:grid-cols-2">
        <Card title="This week" subtitle="Core MVP cards are ready for dashboard metrics.">
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex justify-between"><span>Scheduled rides</span><span className="font-semibold text-text">14</span></li>
            <li className="flex justify-between"><span>Swap requests</span><span className="font-semibold text-text">2</span></li>
            <li className="flex justify-between"><span>Unread messages</span><span className="font-semibold text-text">5</span></li>
          </ul>
        </Card>
        <Card title="Quick actions" subtitle="Ready for authentication and dashboard workflows.">
          <div className="flex flex-col gap-3 tablet:flex-row tablet:flex-wrap">
            <Button>View routes</Button>
            <Button variant="secondary">Manage family</Button>
            <Button variant="success">Create group</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
