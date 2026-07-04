import { NextRequest, NextResponse } from 'next/server'
import { getSupplier } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supplier = await getSupplier(params.id)

  if (!supplier) {
    return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
  }

  return NextResponse.json(supplier)
}
