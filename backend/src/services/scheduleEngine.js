const toDateNumber = (value) => Number(value.replaceAll('-', ''))

export function recomputeAssignments({ store, groupId, fromDate, toDate, initiatedBy }) {
  const from = fromDate ? toDateNumber(fromDate) : 0
  const to = toDate ? toDateNumber(toDate) : Number.MAX_SAFE_INTEGER
  const membershipRows = store.memberships.filter((m) => m.groupId === groupId)
  const driverPool = membershipRows.filter((m) => m.role === 'driver' || m.role === 'owner').map((m) => m.userId)

  if (driverPool.length === 0) {
    return { assignments: [], conflicts: ['No eligible drivers found for this group.'] }
  }

  const driveCounts = new Map(driverPool.map((driverId) => [driverId, 0]))
  for (const assignment of store.assignments.values()) {
    if (assignment.groupId === groupId && driveCounts.has(assignment.driverId)) {
      driveCounts.set(assignment.driverId, (driveCounts.get(assignment.driverId) ?? 0) + 1)
    }
  }

  const updatedAssignments = []
  const conflicts = []
  const slots = [...store.rideSlots.values()]
    .filter((slot) => slot.groupId === groupId)
    .filter((slot) => {
      const dateAsNumber = toDateNumber(slot.date)
      return dateAsNumber >= from && dateAsNumber <= to
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))

  let cursor = 0
  for (const slot of slots) {
    const sortedByFairness = [...driverPool].sort((a, b) => {
      const scoreA = driveCounts.get(a) ?? 0
      const scoreB = driveCounts.get(b) ?? 0
      if (scoreA !== scoreB) return scoreA - scoreB
      return a.localeCompare(b)
    })

    const selectedDriver = sortedByFairness[cursor % sortedByFairness.length]
    cursor += 1

    const assignment = [...store.assignments.values()].find((row) => row.rideSlotId === slot.id)
    if (!assignment) {
      conflicts.push(`Missing assignment container for ride slot ${slot.id}`)
      continue
    }

    const riders = membershipRows
      .map((row) => row.userId)
      .filter((id) => id !== selectedDriver)
      .slice(0, Math.max(0, slot.capacity - 1))

    const conflictReasons = []
    if (riders.length + 1 > slot.capacity) {
      conflictReasons.push('Capacity exceeded for requested rider count')
    }

    assignment.driverId = selectedDriver
    assignment.riderIds = riders
    assignment.fairnessScore = driveCounts.get(selectedDriver) ?? 0
    assignment.conflictReasons = conflictReasons
    assignment.manualOverride = false
    assignment.version += 1
    assignment.updatedAt = new Date().toISOString()
    updatedAssignments.push(assignment)

    driveCounts.set(selectedDriver, (driveCounts.get(selectedDriver) ?? 0) + 1)
  }

  const currentVersion = store.groupScheduleVersion.get(groupId) ?? 0
  store.groupScheduleVersion.set(groupId, currentVersion + 1)

  store.addAudit({
    actorUserId: initiatedBy,
    entityType: 'assignment',
    entityId: groupId,
    action: 'recompute',
    details: { fromDate, toDate, recomputedAssignments: updatedAssignments.length },
  })

  return { assignments: updatedAssignments, conflicts, scheduleVersion: currentVersion + 1 }
}
