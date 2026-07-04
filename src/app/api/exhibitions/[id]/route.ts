import { NextRequest, NextResponse } from 'next/server'
import { getOne } from '@/lib/db'
import type { Exhibition } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const exhibition = await getOne<Exhibition>('exhibition', params.id)
  if (!exhibition) {
    return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 })
  }
  return NextResponse.json(exhibition)
}
