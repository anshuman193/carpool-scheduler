import test from 'node:test'
import assert from 'node:assert/strict'

import { createBackendServer } from '../src/server.js'

const jsonFetch = async (baseUrl, path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'content-type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  const body = await response.json()
  return { status: response.status, body }
}

test('auth, groups, and schedule contracts are stable', async () => {
  const app = createBackendServer()
  const address = await app.listen(0)
  const port = typeof address === 'object' && address ? address.port : 0
  const baseUrl = `http://127.0.0.1:${port}`

  try {
    const login = await jsonFetch(baseUrl, '/api/v1/auth/google/verify', {
      method: 'POST',
      body: JSON.stringify({ idToken: 'demo-google-token' }),
    })

    assert.equal(login.status, 200)
    assert.equal(typeof login.body.user.email, 'string')
    assert.equal(typeof login.body.session.accessToken, 'string')
    assert.equal(typeof login.body.session.refreshToken, 'string')

    const token = login.body.session.accessToken

    const groups = await jsonFetch(baseUrl, '/api/v1/groups', {
      headers: { authorization: 'Bearer ' + token },
    })

    assert.equal(groups.status, 200)
    assert.ok(Array.isArray(groups.body.groups))
    assert.ok(groups.body.groups.length >= 1)

    const schedule = await jsonFetch(baseUrl, `/api/v1/schedule?groupId=${groups.body.groups[0].id}`, {
      headers: { authorization: 'Bearer ' + token },
    })

    assert.equal(schedule.status, 200)
    assert.equal(schedule.body.groupId, groups.body.groups[0].id)
    assert.ok(Array.isArray(schedule.body.rides))
    assert.ok(Array.isArray(schedule.body.assignments))
  } finally {
    await app.close()
  }
})
