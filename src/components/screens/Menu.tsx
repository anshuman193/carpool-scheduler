import { Card } from '@components/shared/Card'
import { Input } from '@components/shared/Input'

export function Menu() {
  return (
    <div className="grid gap-4 desktop:grid-cols-2">
      <Card title="Settings" subtitle="Configuration panels can expand here as the MVP grows.">
        <div className="space-y-4">
          <Input label="Notification email" type="email" placeholder="parent@example.com" successMessage="Validation state ready" />
          <Input label="School search" placeholder="Find a school" helperText="Use for future onboarding and group discovery flows." />
        </div>
      </Card>
      <Card title="Account" subtitle="Authentication screens can plug into this shell without refactoring layouts.">
        <ul className="space-y-3 text-sm text-muted">
          <li>Profile settings</li>
          <li>Theme preferences</li>
          <li>Connected children and guardians</li>
          <li>Support and legal resources</li>
        </ul>
      </Card>
    </div>
  )
}
