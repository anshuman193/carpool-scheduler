import { config } from './config.js'
import { readAccessSession } from './services/authService.js'

export function requestLogger(req, context) {
  const startedAt = Date.now()
  return (statusCode) => {
    const log = {
      level: 'info',
      at: new Date().toISOString(),
      requestId: context.requestId,
      method: req.method,
      path: req.url,
      statusCode,
      latencyMs: Date.now() - startedAt,
      userId: context.user?.id ?? null,
    }
    console.log(JSON.stringify(log))
  }
}

export function enforceRateLimit(req, state) {
  const nowMs = Date.now()
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
  const windowMs = config.rateLimitWindowSeconds * 1000
  const bucket = state.rateLimiter.get(ip) ?? []
  const recent = bucket.filter((timestamp) => nowMs - timestamp < windowMs)
  recent.push(nowMs)
  state.rateLimiter.set(ip, recent)

  return recent.length <= config.rateLimitMaxRequests
}

export function tryReadJsonBody(bodyBuffer) {
  if (!bodyBuffer) return {}
  try {
    return JSON.parse(bodyBuffer)
  } catch {
    return null
  }
}

export function requireAuth(req, store) {
  const authorization = req.headers.authorization
  if (!authorization?.startsWith('Bearer ')) {
    return { ok: false, status: 401, message: 'Missing bearer token' }
  }

  const token = authorization.replace('Bearer ', '')
  const session = readAccessSession(store, token)
  if (!session) {
    return { ok: false, status: 401, message: 'Session expired or invalid' }
  }

  const user = store.users.get(session.userId)
  if (!user) {
    return { ok: false, status: 401, message: 'User not found for session' }
  }

  return { ok: true, token, session, user }
}

export function requireGroupMembership(store, { groupId, userId, acceptedRoles = null }) {
  const rows = store.memberships.filter((row) => row.groupId === groupId && row.userId === userId)
  if (rows.length === 0) {
    return { ok: false, status: 403, message: 'You are not a member of this group' }
  }

  if (acceptedRoles && !rows.some((row) => acceptedRoles.includes(row.role))) {
    return { ok: false, status: 403, message: 'Your role cannot perform this action' }
  }

  return { ok: true, memberships: rows }
}

export function enforceIdempotency(store, requestScope) {
  const idempotencyKey = requestScope.headers['idempotency-key']
  if (!idempotencyKey) return null

  const scope = `${requestScope.userId ?? 'anonymous'}:${requestScope.method}:${requestScope.path}:${idempotencyKey}`
  const now = Date.now()
  const record = store.idempotencyRecords.get(scope)
  if (record && now < record.expiresAtMs) {
    return record.response
  }

  return {
    persist(response) {
      store.idempotencyRecords.set(scope, {
        response,
        expiresAtMs: now + config.idempotencyTtlSeconds * 1000,
      })
    },
  }
}
