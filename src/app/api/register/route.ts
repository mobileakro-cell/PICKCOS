import { NextRequest, NextResponse } from 'next/server'
import { listAll, insertOne } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

interface MemberSignup {
  id: string
  company: string
  name: string
  email: string
  role?: string
  country?: string
  interest?: string
  createdAt: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company, name, email, role, country, interest } = body

    if (!company || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const id = `MEM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    await insertOne('member', { company, name, email, role, country, interest, createdAt: new Date().toISOString() }, id)

    return NextResponse.json({ memberId: id }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  if (!getAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20', 10)
  const all = await listAll<MemberSignup>('member')
  return NextResponse.json({ members: all.slice(-limit).reverse(), total: all.length })
}
