import { NextRequest, NextResponse } from 'next/server'
import { mockExhibitions } from '@/lib/mock'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const exhibition = mockExhibitions.find(e => e.id === params.id)
  if (!exhibition) {
    return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 })
  }
  return NextResponse.json(exhibition)
}
