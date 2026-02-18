import { NextRequest, NextResponse } from 'next/server'

// Admin accounts - in production, use a database + hashed passwords
const ADMIN_ACCOUNTS = [
  { id: 'PICKCOS', password: '202670', role: 'super' as const, name: 'Super Admin' },
  { id: 'admin', password: 'admin1234', role: 'admin' as const, name: 'Admin' },
]

export type AdminRole = 'super' | 'admin'

export async function POST(request: NextRequest) {
  const { id, password } = await request.json()

  if (!id || !password) {
    return NextResponse.json({ error: 'ID and password are required' }, { status: 400 })
  }

  const account = ADMIN_ACCOUNTS.find(a => a.id === id && a.password === password)

  if (!account) {
    return NextResponse.json({ error: 'Invalid ID or password' }, { status: 401 })
  }

  return NextResponse.json({
    success: true,
    user: { id: account.id, role: account.role, name: account.name },
  })
}
