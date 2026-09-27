const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const config = {
  port: toInt(process.env.PORT, 3000),
  apiPrefix: process.env.API_PREFIX ?? '/api/v1',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  allowDemoIdToken: process.env.ALLOW_DEMO_ID_TOKEN !== 'false',
  accessTokenTtlSeconds: toInt(process.env.ACCESS_TOKEN_TTL_SECONDS, 15 * 60),
  refreshTokenTtlSeconds: toInt(process.env.REFRESH_TOKEN_TTL_SECONDS, 7 * 24 * 60 * 60),
  idempotencyTtlSeconds: toInt(process.env.IDEMPOTENCY_TTL_SECONDS, 24 * 60 * 60),
  rateLimitWindowSeconds: toInt(process.env.RATE_LIMIT_WINDOW_SECONDS, 60),
  rateLimitMaxRequests: toInt(process.env.RATE_LIMIT_MAX_REQUESTS, 120),
  sla: {
    availabilityTarget: '99.9%',
    p95ReadLatencyMs: 200,
    p95WriteLatencyMs: 350,
    auditRetentionDays: 365,
    notificationRetentionDays: 180,
  },
}
