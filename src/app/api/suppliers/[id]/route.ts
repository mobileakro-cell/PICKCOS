import { NextRequest, NextResponse } from 'next/server'
import { mockSuppliers } from '@/lib/mock'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supplier = mockSuppliers.find(s => s.id === params.id)

  if (!supplier) {
    return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
  }

  return NextResponse.json(supplier)
}
