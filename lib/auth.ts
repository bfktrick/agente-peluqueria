import { createHash, createHmac, timingSafeEqual } from 'crypto'

export const SESSION_COOKIE = 'ag_admin_session'

const SECRET = process.env.ADMIN_SESSION_SECRET ?? 'fallback-secret-change-in-production'
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 días

export function hashPassword(password: string): string {
  return createHash('sha256').update(password + SECRET).digest('hex')
}

export function makeToken(email: string): string {
  const payload = `${email}:${Date.now()}`
  const sig = createHmac('sha256', SECRET).update(payload).digest('hex')
  return Buffer.from(`${payload}:${sig}`).toString('base64url')
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const lastColon = decoded.lastIndexOf(':')
    const payload = decoded.slice(0, lastColon)
    const sig = decoded.slice(lastColon + 1)
    const expected = createHmac('sha256', SECRET).update(payload).digest('hex')
    const sigBuf = Buffer.from(sig)
    const expBuf = Buffer.from(expected)
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false
    const timestamp = parseInt(payload.split(':')[1] ?? '0')
    return Date.now() - timestamp < MAX_AGE_MS
  } catch {
    return false
  }
}
