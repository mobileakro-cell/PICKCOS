import { NextRequest, NextResponse } from 'next/server'
import { listAll, insertOne } from '@/lib/db'
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

export async function POST(request: NextRequest) {
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
