import { NextRequest, NextResponse } from 'next/server'
import { listAll, insertOne, patchOne, removeOne, upsertOne } from '@/lib/db'
import type { Exhibition } from '@/lib/types'
import { getAdmin } from '@/lib/auth'

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'all'
  const region = searchParams.get('region') || 'all'
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '12', 10)

  let filtered = await listAll<Exhibition>('exhibition')

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
  if (!getAdmin(request)) return unauthorized()
  try {
    const body = await request.json()
    // CSV import sends a 번호(id) → upsert so the number stays a stable key
    if (body.id) {
      await upsertOne('exhibition', String(body.id), { ...body, id: String(body.id) })
      return NextResponse.json({ ...body }, { status: 201 })
    }
    const exhibition = await insertOne('exhibition', body)
    return NextResponse.json(exhibition, { status: 201 })
  } catch (error) {
    console.error('Exhibition create error:', error)
    return NextResponse.json({ error: 'Failed to create exhibition' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!getAdmin(request)) return unauthorized()
  try {
    const body = await request.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    const updated = await patchOne<Exhibition>('exhibition', id, data)
    if (!updated) return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Exhibition update error:', error)
    return NextResponse.json({ error: 'Failed to update exhibition' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!getAdmin(request)) return unauthorized()
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    const deleted = await removeOne('exhibition', id)
    if (!deleted) return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Exhibition delete error:', error)
    return NextResponse.json({ error: 'Failed to delete exhibition' }, { status: 500 })
  }
}
