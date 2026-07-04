import crypto from 'crypto'
import type { NextRequest } from 'next/server'

const SECRET = process.env.SESSION_SECRET || 'dev-insecure-secret-change-me'
export const ADMIN_COOKIE = 'pickcos_admin'
export const ADMIN_COOKIE_MAXAGE = 60 * 60 * 12 // 12 hours

export type AdminSession = { id: string; role: 'super' | 'admin'; name: string; exp: number }

export function signSession(user: { id: string; role: 'super' | 'admin'; name: string }): string {
  const payload: AdminSession = { ...user, exp: Date.now() + ADMIN_COOKIE_MAXAGE * 1000 }
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url')
  return `${body}.${sig}`
}

export function verifySession(token?: string): AdminSession | null {
  if (!token) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as AdminSession
    if (!payload.exp || payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

// Returns the admin session if the request carries a valid cookie, else null.
export function getAdmin(req: NextRequest): AdminSession | null {
  return verifySession(req.cookies.get(ADMIN_COOKIE)?.value)
}
