import { NextRequest, NextResponse } from 'next/server'
import { signSession, ADMIN_COOKIE, ADMIN_COOKIE_MAXAGE } from '@/lib/auth'

export type AdminRole = 'super' | 'admin'

// Credentials come from environment variables in production.
// Local fallback keeps dev working when env vars are not set.
function getAccounts() {
  return [
    {
      id: process.env.ADMIN_ID || 'PICKCOS',
      password: process.env.ADMIN_PW || '202670',
      role: 'super' as const,
      name: 'Super Admin',
    },
    {
      id: process.env.ADMIN2_ID || 'admin',
      password: process.env.ADMIN2_PW || 'admin1234',
      role: 'admin' as const,
      name: 'Admin',
    },
  ]
}

export async function POST(request: NextRequest) {
  const { id, password } = await request.json()

  if (!id || !password) {
    return NextResponse.json({ error: 'ID and password are required' }, { status: 400 })
  }

  const account = getAccounts().find((a) => a.id === id && a.password === password)

  if (!account) {
    return NextResponse.json({ error: 'Invalid ID or password' }, { status: 401 })
  }

  const user = { id: account.id, role: account.role, name: account.name }
  const res = NextResponse.json({ success: true, user })
  res.cookies.set(ADMIN_COOKIE, signSession(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAXAGE,
  })
  return res
}

// Logout — clears the session cookie
export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
