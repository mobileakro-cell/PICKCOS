import { NextRequest, NextResponse } from 'next/server'
import { getSupplier, listAll } from '@/lib/db'
import type { Exhibition } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supplier = await getSupplier(params.id)

  if (!supplier) {
    return NextResponse.json([], { status: 200 })
  }

  const exhibitions = (await listAll<Exhibition>('exhibition')).filter((e) =>
    e.supplierIds.includes(params.id)
  )

  return NextResponse.json(exhibitions)
}
