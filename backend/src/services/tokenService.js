import crypto from 'node:crypto'

export const createOpaqueToken = () => crypto.randomBytes(32).toString('hex')

export const createId = (prefix) => `${prefix}_${crypto.randomBytes(8).toString('hex')}`
