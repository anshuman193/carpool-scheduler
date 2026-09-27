import { config } from './config.js'
import { DeliveryStatus, GroupRole, SwapStatus } from './domain/models.js'
import { enforceIdempotency, requireAuth, requireGroupMembership, tryReadJsonBody } from './middleware.js'
import { createSession, revokeSession, rotateRefreshSession, upsertUserFromGoogleClaims, verifyGoogleToken } from './services/authService.js'
import { recomputeAssignments } from './services/scheduleEngine.js'
import { createId } from './services/tokenService.js'

const json = (status, data) => ({ status, data })

const parsePath = (pathname) => pathname.replace(/\/+$/, '') || '/'

export async function routeRequest({ req, store, path, body, requestId }) {
  const method = req.method ?? 'GET'
  const safePath = parsePath(path)
  const auth = requireAuth(req, store)

  const buildResponse = (result, context = {}) => ({
    status: result.status,
    body: {
      requestId,
      ...result.data,
      ...context,
    },
  })

  if (method === 'GET' && safePath === `${config.apiPrefix}/health`) {
    return buildResponse(json(200, { status: 'ok', timestamp: new Date().toISOString() }))
  }

  if (method === 'GET' && safePath === `${config.apiPrefix}/meta/sla`) {
    return buildResponse(json(200, { sla: config.sla }))
  }

  if (method === 'POST' && safePath === `${config.apiPrefix}/auth/google/verify`) {
    const parsed = tryReadJsonBody(body)
    if (!parsed || typeof parsed.idToken !== 'string' || parsed.idToken.length < 5) {
      return buildResponse(json(400, { error: 'idToken is required' }))
    }

    try {
      const claims = await verifyGoogleToken(parsed.idToken)
      const user = upsertUserFromGoogleClaims(store, claims)
      const session = createSession(store, user.id)

      store.addAudit({
        actorUserId: user.id,
        entityType: 'session',
        entityId: user.id,
        action: 'login',
      })

      return buildResponse(json(200, {
        user,
        session: {
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          tokenType: 'Bearer',
          expiresIn: config.accessTokenTtlSeconds,
          refreshExpiresIn: config.refreshTokenTtlSeconds,
        },
      }))
    } catch (error) {
      return buildResponse(json(401, { error: error instanceof Error ? error.message : 'Authentication failed' }))
    }
  }

  if (method === 'GET' && safePath === `${config.apiPrefix}/auth/session`) {
    if (!auth.ok) {
      return buildResponse(json(auth.status, { error: auth.message }))
    }

    return buildResponse(json(200, {
      user: auth.user,
      session: {
        accessToken: auth.token,
        tokenType: 'Bearer',
        expiresIn: Math.max(0, auth.session.accessExpiresAt - Math.floor(Date.now() / 1000)),
      },
    }))
  }

  if (method === 'POST' && safePath === `${config.apiPrefix}/auth/session/refresh`) {
    const parsed = tryReadJsonBody(body)
    if (!parsed || typeof parsed.refreshToken !== 'string') {
      return buildResponse(json(400, { error: 'refreshToken is required' }))
    }

    const rotated = rotateRefreshSession(store, parsed.refreshToken)
    if (!rotated) {
      return buildResponse(json(401, { error: 'Refresh token expired or invalid' }))
    }

    const user = store.users.get(rotated.userId)
    return buildResponse(json(200, {
      user,
      session: {
        accessToken: rotated.accessToken,
        refreshToken: rotated.refreshToken,
        tokenType: 'Bearer',
        expiresIn: config.accessTokenTtlSeconds,
        refreshExpiresIn: config.refreshTokenTtlSeconds,
      },
    }))
  }

  if (method === 'POST' && safePath === `${config.apiPrefix}/auth/logout`) {
    const parsed = tryReadJsonBody(body) || {}
    const accessToken = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.replace('Bearer ', '') : null
    revokeSession(store, { accessToken, refreshToken: typeof parsed.refreshToken === 'string' ? parsed.refreshToken : null })
    return buildResponse(json(200, { success: true }))
  }

  if (!auth.ok) {
    return buildResponse(json(auth.status, { error: auth.message }))
  }

  const url = new URL(req.url ?? '/', 'http://localhost')

  if (method === 'GET' && safePath === `${config.apiPrefix}/groups`) {
    const memberGroupIds = new Set(store.memberships.filter((row) => row.userId === auth.user.id).map((row) => row.groupId))
    const items = [...store.groups.values()].filter((group) => memberGroupIds.has(group.id))
    return buildResponse(json(200, { groups: items }))
  }

  if (method === 'POST' && safePath === `${config.apiPrefix}/groups`) {
    const idempotent = enforceIdempotency(store, { headers: req.headers, userId: auth.user.id, method, path: safePath })
    if (idempotent?.status) {
      return buildResponse({ status: idempotent.status, data: idempotent.body })
    }

    const parsed = tryReadJsonBody(body)
    if (!parsed || typeof parsed.name !== 'string' || parsed.name.trim().length < 3) {
      return buildResponse(json(400, { error: 'Group name must be at least 3 characters.' }))
    }

    const group = store.createGroup({
      name: parsed.name.trim(),
      routeFrom: typeof parsed.routeFrom === 'string' ? parsed.routeFrom : 'Unknown',
      routeTo: typeof parsed.routeTo === 'string' ? parsed.routeTo : 'Unknown',
      createdBy: auth.user.id,
    })

    store.memberships.push(
      { id: createId('mbr'), groupId: group.id, userId: auth.user.id, role: GroupRole.OWNER, createdAt: new Date().toISOString() },
      { id: createId('mbr'), groupId: group.id, userId: auth.user.id, role: GroupRole.DRIVER, createdAt: new Date().toISOString() },
    )

    store.addAudit({ actorUserId: auth.user.id, entityType: 'group', entityId: group.id, action: 'create' })

    const response = { group }
    idempotent?.persist({ status: 201, body: response })
    return buildResponse(json(201, response))
  }

  const memberMatch = safePath.match(new RegExp(`^${config.apiPrefix}/groups/([^/]+)/members$`))
  if (method === 'GET' && memberMatch) {
    const groupId = memberMatch[1]
    const membership = requireGroupMembership(store, { groupId, userId: auth.user.id })
    if (!membership.ok) return buildResponse(json(membership.status, { error: membership.message }))

    const members = store.memberships
      .filter((row) => row.groupId === groupId)
      .map((row) => ({
        role: row.role,
        user: store.users.get(row.userId),
      }))

    return buildResponse(json(200, { members }))
  }

  if (method === 'GET' && safePath === `${config.apiPrefix}/schedule`) {
    const groupId = url.searchParams.get('groupId')
    if (!groupId) return buildResponse(json(400, { error: 'groupId is required' }))

    const membership = requireGroupMembership(store, { groupId, userId: auth.user.id })
    if (!membership.ok) return buildResponse(json(membership.status, { error: membership.message }))

    const rides = [...store.rideSlots.values()].filter((slot) => slot.groupId === groupId)
    const scheduleAssignments = [...store.assignments.values()].filter((assignment) => assignment.groupId === groupId)

    return buildResponse(json(200, {
      groupId,
      version: store.groupScheduleVersion.get(groupId) ?? 0,
      rides,
      assignments: scheduleAssignments,
    }))
  }

  if (method === 'GET' && safePath === `${config.apiPrefix}/rides`) {
    const groupId = url.searchParams.get('groupId')
    if (!groupId) return buildResponse(json(400, { error: 'groupId is required' }))

    const membership = requireGroupMembership(store, { groupId, userId: auth.user.id })
    if (!membership.ok) return buildResponse(json(membership.status, { error: membership.message }))

    const rides = [...store.rideSlots.values()].filter((slot) => slot.groupId === groupId)
    return buildResponse(json(200, { rides }))
  }

  if (method === 'GET' && safePath === `${config.apiPrefix}/assignments`) {
    const groupId = url.searchParams.get('groupId')
    if (!groupId) return buildResponse(json(400, { error: 'groupId is required' }))

    const membership = requireGroupMembership(store, { groupId, userId: auth.user.id })
    if (!membership.ok) return buildResponse(json(membership.status, { error: membership.message }))

    const list = [...store.assignments.values()].filter((assignment) => assignment.groupId === groupId)
    return buildResponse(json(200, { assignments: list, version: store.groupScheduleVersion.get(groupId) ?? 0 }))
  }

  if (method === 'POST' && safePath === `${config.apiPrefix}/assignments/recompute`) {
    const parsed = tryReadJsonBody(body)
    if (!parsed || typeof parsed.groupId !== 'string') {
      return buildResponse(json(400, { error: 'groupId is required' }))
    }

    const membership = requireGroupMembership(store, {
      groupId: parsed.groupId,
      userId: auth.user.id,
      acceptedRoles: [GroupRole.OWNER, GroupRole.COORDINATOR],
    })
    if (!membership.ok) return buildResponse(json(membership.status, { error: membership.message }))

    const currentVersion = store.groupScheduleVersion.get(parsed.groupId) ?? 0
    if (typeof parsed.expectedVersion === 'number' && parsed.expectedVersion !== currentVersion) {
      return buildResponse(json(409, { error: 'Schedule version conflict', currentVersion }))
    }

    const result = recomputeAssignments({
      store,
      groupId: parsed.groupId,
      fromDate: typeof parsed.fromDate === 'string' ? parsed.fromDate : null,
      toDate: typeof parsed.toDate === 'string' ? parsed.toDate : null,
      initiatedBy: auth.user.id,
    })

    return buildResponse(json(200, result))
  }

  if (method === 'GET' && safePath === `${config.apiPrefix}/swaps`) {
    const groupId = url.searchParams.get('groupId')
    if (!groupId) return buildResponse(json(400, { error: 'groupId is required' }))

    const membership = requireGroupMembership(store, { groupId, userId: auth.user.id })
    if (!membership.ok) return buildResponse(json(membership.status, { error: membership.message }))

    const swaps = [...store.swapRequests.values()].filter((swap) => swap.groupId === groupId)
    return buildResponse(json(200, { swaps }))
  }

  if (method === 'POST' && safePath === `${config.apiPrefix}/swaps`) {
    const parsed = tryReadJsonBody(body)
    if (!parsed || typeof parsed.groupId !== 'string' || typeof parsed.assignmentId !== 'string') {
      return buildResponse(json(400, { error: 'groupId and assignmentId are required' }))
    }

    const membership = requireGroupMembership(store, { groupId: parsed.groupId, userId: auth.user.id })
    if (!membership.ok) return buildResponse(json(membership.status, { error: membership.message }))

    const assignment = store.assignments.get(parsed.assignmentId)
    if (!assignment || assignment.groupId !== parsed.groupId) {
      return buildResponse(json(404, { error: 'Assignment not found' }))
    }

    const swap = store.createSwap({
      groupId: parsed.groupId,
      assignmentId: parsed.assignmentId,
      requestedByUserId: auth.user.id,
      requestedToUserId: typeof parsed.requestedToUserId === 'string' ? parsed.requestedToUserId : null,
      reason: typeof parsed.reason === 'string' ? parsed.reason : null,
    })

    store.addAudit({ actorUserId: auth.user.id, entityType: 'swap', entityId: swap.id, action: 'request' })

    return buildResponse(json(201, { swap }))
  }

  const swapRespondMatch = safePath.match(new RegExp(`^${config.apiPrefix}/swaps/([^/]+)/respond$`))
  if (method === 'POST' && swapRespondMatch) {
    const parsed = tryReadJsonBody(body)
    const swap = store.swapRequests.get(swapRespondMatch[1])
    if (!swap) {
      return buildResponse(json(404, { error: 'Swap request not found' }))
    }

    const membership = requireGroupMembership(store, { groupId: swap.groupId, userId: auth.user.id })
    if (!membership.ok) return buildResponse(json(membership.status, { error: membership.message }))

    if (!parsed || typeof parsed.action !== 'string' || !['accept', 'decline', 'cancel'].includes(parsed.action)) {
      return buildResponse(json(400, { error: 'action must be accept, decline, or cancel' }))
    }

    if (typeof parsed.version !== 'number') {
      return buildResponse(json(400, { error: 'version is required for optimistic locking' }))
    }

    if (parsed.version !== swap.version) {
      return buildResponse(json(409, { error: 'Swap version conflict', currentVersion: swap.version }))
    }

    if (parsed.action === 'accept') swap.status = SwapStatus.ACCEPTED
    if (parsed.action === 'decline') swap.status = SwapStatus.DECLINED
    if (parsed.action === 'cancel') swap.status = SwapStatus.CANCELLED
    swap.version += 1
    swap.respondedByUserId = auth.user.id
    swap.updatedAt = new Date().toISOString()

    store.addAudit({ actorUserId: auth.user.id, entityType: 'swap', entityId: swap.id, action: parsed.action })

    return buildResponse(json(200, { swap }))
  }

  if (method === 'GET' && safePath === `${config.apiPrefix}/chat/threads`) {
    const groupId = url.searchParams.get('groupId')
    if (!groupId) return buildResponse(json(400, { error: 'groupId is required' }))

    const membership = requireGroupMembership(store, { groupId, userId: auth.user.id })
    if (!membership.ok) return buildResponse(json(membership.status, { error: membership.message }))

    const threads = [...store.chatThreads.values()].filter((thread) => thread.groupId === groupId)
    return buildResponse(json(200, { threads }))
  }

  if (method === 'GET' && safePath === `${config.apiPrefix}/chat/messages`) {
    const threadId = url.searchParams.get('threadId')
    if (!threadId) return buildResponse(json(400, { error: 'threadId is required' }))

    const thread = store.chatThreads.get(threadId)
    if (!thread) return buildResponse(json(404, { error: 'Thread not found' }))

    const membership = requireGroupMembership(store, { groupId: thread.groupId, userId: auth.user.id })
    if (!membership.ok) return buildResponse(json(membership.status, { error: membership.message }))

    const threadMessages = [...store.messages.values()]
      .filter((message) => message.threadId === threadId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    return buildResponse(json(200, { messages: threadMessages }))
  }

  if (method === 'POST' && safePath === `${config.apiPrefix}/chat/messages`) {
    const parsed = tryReadJsonBody(body)
    if (!parsed || typeof parsed.threadId !== 'string' || typeof parsed.body !== 'string' || parsed.body.trim().length === 0) {
      return buildResponse(json(400, { error: 'threadId and body are required' }))
    }

    const thread = store.chatThreads.get(parsed.threadId)
    if (!thread) return buildResponse(json(404, { error: 'Thread not found' }))

    const membership = requireGroupMembership(store, { groupId: thread.groupId, userId: auth.user.id })
    if (!membership.ok) return buildResponse(json(membership.status, { error: membership.message }))

    const message = store.createMessage({ threadId: parsed.threadId, senderId: auth.user.id, body: parsed.body.trim() })
    return buildResponse(json(201, { message }))
  }

  if (method === 'GET' && safePath === `${config.apiPrefix}/notifications`) {
    const items = [...store.notifications.values()].filter((notification) => notification.userId === auth.user.id)
    return buildResponse(json(200, { notifications: items }))
  }

  if (method === 'GET' && safePath === `${config.apiPrefix}/me/dashboard`) {
    const userGroups = store.memberships.filter((row) => row.userId === auth.user.id)
    const groupIds = new Set(userGroups.map((row) => row.groupId))
    const groupCount = groupIds.size
    const upcomingRides = [...store.rideSlots.values()].filter((ride) => groupIds.has(ride.groupId)).length
    const pendingSwaps = [...store.swapRequests.values()].filter((swap) => groupIds.has(swap.groupId) && swap.status === SwapStatus.REQUESTED).length
    const unreadNotifications = [...store.notifications.values()].filter((n) => n.userId === auth.user.id && !n.readAt).length

    return buildResponse(json(200, {
      metrics: {
        groupCount,
        upcomingRides,
        pendingSwaps,
        unreadNotifications,
      },
    }))
  }

  if (method === 'GET' && safePath === `${config.apiPrefix}/admin/moderation`) {
    if (!auth.user.isAdmin) {
      return buildResponse(json(403, { error: 'Admin role required' }))
    }

    return buildResponse(json(200, {
      openSwaps: [...store.swapRequests.values()].filter((swap) => swap.status === SwapStatus.REQUESTED).length,
      queuedNotifications: [...store.notifications.values()].filter((n) => n.deliveryStatus === DeliveryStatus.QUEUED).length,
      auditEvents: store.auditLogs.length,
    }))
  }

  if (method === 'GET' && safePath === `${config.apiPrefix}/reports/analytics`) {
    const groupId = url.searchParams.get('groupId')
    if (!groupId) return buildResponse(json(400, { error: 'groupId is required' }))

    const membership = requireGroupMembership(store, { groupId, userId: auth.user.id })
    if (!membership.ok) return buildResponse(json(membership.status, { error: membership.message }))

    const groupAssignments = [...store.assignments.values()].filter((assignment) => assignment.groupId === groupId)
    const drivesByUser = groupAssignments.reduce((acc, assignment) => {
      acc[assignment.driverId] = (acc[assignment.driverId] ?? 0) + 1
      return acc
    }, {})

    return buildResponse(json(200, {
      groupId,
      totalAssignments: groupAssignments.length,
      drivesByUser,
      averageConflictsPerAssignment:
        groupAssignments.length === 0
          ? 0
          : groupAssignments.reduce((total, assignment) => total + assignment.conflictReasons.length, 0) / groupAssignments.length,
    }))
  }

  return buildResponse(json(404, { error: 'Not found' }))
}
