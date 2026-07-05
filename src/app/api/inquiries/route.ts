import { NextRequest, NextResponse } from 'next/server'
import { listAll, insertOne, patchOne } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

interface InquiryPayload {
  inquiryType: string
  category: string
  targetMarkets: string[]
  description: string
  fileName?: string
  supplierId?: string
  topic?: string
}

function generateTicketId(): string {
  return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

// Public inquiry submissions are currently closed (event capacity reached) — the
// /contact page shows a "신청이 마감되었습니다" notice. Flip to false to reopen,
// and keep it in sync with the UI notice.
const SUBMISSIONS_CLOSED = true

export async function POST(request: NextRequest) {
  if (SUBMISSIONS_CLOSED) {
    return NextResponse.json({ error: '신청이 마감되었습니다.' }, { status: 403 })
  }
  try {
    const body: InquiryPayload = await request.json()

    if (!body.inquiryType || !body.category || !body.description || !body.targetMarkets?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const ticketId = generateTicketId()
    await insertOne('inquiry', { ...body, status: 'new', createdAt: new Date().toISOString() }, ticketId)

    return NextResponse.json({ ticketId }, { status: 201 })
  } catch (error) {
    console.error('Inquiry submission error:', error)
    return NextResponse.json({ error: 'Failed to process inquiry' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  if (!getAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10', 10)
  const all = await listAll('inquiry')
  return NextResponse.json({ inquiries: all.slice(-limit), total: all.length })
}

// Admin-only: update an inquiry's status.
export async function PATCH(request: NextRequest) {
  if (!getAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, status } = await request.json()
    if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    const updated = await patchOne('inquiry', id, { status })
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Inquiry update error:', error)
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
  }
}
