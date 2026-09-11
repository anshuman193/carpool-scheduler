import { Badge } from '@components/shared/Badge'
import { Card } from '@components/shared/Card'
import { Input } from '@components/shared/Input'

export function Chat() {
  return (
    <Card title="Chat" subtitle="Desktop and tablet layouts are ready for future split-view conversations.">
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="rounded-xl bg-surface-alt p-4 text-sm text-muted">
            <div className="mb-2 flex items-center gap-2">
              <span className="font-semibold text-text">Maya</span>
              <Badge variant="primary">2 min ago</Badge>
            </div>
            Can you cover Friday afternoon pickup if practice runs late?
          </div>
          <div className="rounded-xl bg-brand p-4 text-sm text-white">
            Sure — I can swap if you handle Monday morning next week.
          </div>
        </div>
        <Input label="Message draft" placeholder="Reply to the group..." helperText="Wire this field to your chat service in the MVP." />
      </div>
    </Card>
  )
}
