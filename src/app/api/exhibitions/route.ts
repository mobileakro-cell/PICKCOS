import { NextRequest, NextResponse } from 'next/server'
import { mockExhibitions, addExhibition, updateExhibition, deleteExhibition } from '@/lib/mock'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'all'
  const region = searchParams.get('region') || 'all'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '12', 10)

  let filtered = mockExhibitions

  // Filter by status
  if (status !== 'all') {
    filtered = filtered.filter(e => e.status === status)
  }

  // Filter by region
  if (region !== 'all') {
    filtered = filtered.filter(e => e.region === region)
  }

  // Pagination
  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const items = filtered.slice(start, end)

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const exhibition = addExhibition(body)
  return NextResponse.json(exhibition, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { id, ...data } = body
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  const updated = updateExhibition(id, data)
  if (!updated) return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  const deleted = deleteExhibition(id)
  if (!deleted) return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
