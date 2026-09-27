import http from 'node:http'
import { URL } from 'node:url'

import { config } from './config.js'
import { enforceRateLimit, requestLogger } from './middleware.js'
import { routeRequest } from './router.js'
import { createStore } from './store/inMemoryStore.js'

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
      if (body.length > 1024 * 1024) {
        reject(new Error('Body exceeds 1MB limit'))
      }
    })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })

export function createBackendServer({ initialStore } = {}) {
  const store = initialStore ?? createStore()
  const state = {
    rateLimiter: new Map(),
  }

  const server = http.createServer(async (req, res) => {
    const requestId = `req_${Math.random().toString(36).slice(2, 10)}`
    const done = requestLogger(req, { requestId })

    res.setHeader('content-type', 'application/json')
    res.setHeader('x-request-id', requestId)
    res.setHeader('x-content-type-options', 'nosniff')
    res.setHeader('x-frame-options', 'DENY')
    res.setHeader('referrer-policy', 'no-referrer')
    res.setHeader('strict-transport-security', 'max-age=31536000; includeSubDomains')

    if (!enforceRateLimit(req, state)) {
      const payload = JSON.stringify({ requestId, error: 'Too many requests' })
      res.writeHead(429)
      res.end(payload)
      done(429)
      return
    }

    try {
      const body = await readBody(req)
      const url = new URL(req.url ?? '/', `http://${req.headers.host || 'localhost'}`)

      const response = await routeRequest({
        req,
        store,
        path: url.pathname,
        body,
        requestId,
      })

      res.writeHead(response.status)
      res.end(JSON.stringify(response.body))
      done(response.status)
    } catch (error) {
      const status = error instanceof Error && error.message.includes('1MB') ? 413 : 500
      const payload = {
        requestId,
        error: status === 413 ? 'Request body is too large' : 'Internal server error',
      }
      res.writeHead(status)
      res.end(JSON.stringify(payload))
      done(status)
    }
  })

  return {
    server,
    store,
    listen(port = config.port) {
      return new Promise((resolve) => {
        server.listen(port, () => resolve(server.address()))
      })
    },
    close() {
      return new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error)
          else resolve(undefined)
        })
      })
    },
  }
}
