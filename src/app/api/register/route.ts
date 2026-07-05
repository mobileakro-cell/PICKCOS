import { NextRequest, NextResponse } from 'next/server'
import { listAll, insertOne } from '@/lib/db'
import { getAdmin } from '@/lib/auth'
import { sendOperatorNotification } from '@/lib/notify'

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

    await sendOperatorNotification('새 회원 가입', [
      `회원번호: ${id}`,
      `회사: ${company}`,
      `이름: ${name}${role ? ` (${role})` : ''}`,
      `이메일: ${email}`,
      country ? `국가: ${country}` : '',
      interest ? `관심 분야: ${interest}` : '',
    ])

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
