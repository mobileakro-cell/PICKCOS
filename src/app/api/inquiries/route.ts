import { NextRequest, NextResponse } from 'next/server'

interface InquiryPayload {
  inquiryType: string
  category: string
  targetMarkets: string[]
  description: string
  fileName?: string
  supplierId?: string
  topic?: string
}

const inquiries: any[] = []

function generateTicketId(): string {
  return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

export async function POST(request: NextRequest) {
  try {
    const body: InquiryPayload = await request.json()

    if (!body.inquiryType || !body.category || !body.description || !body.targetMarkets?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const ticketId = generateTicketId()
    const inquiry = {
      id: ticketId,
      ...body,
      createdAt: new Date().toISOString(),
    }

    inquiries.push(inquiry)

    return NextResponse.json({ ticketId }, { status: 201 })
  } catch (error) {
    console.error('Inquiry submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10', 10)
  return NextResponse.json({
    inquiries: inquiries.slice(-limit),
    total: inquiries.length,
  })
}
