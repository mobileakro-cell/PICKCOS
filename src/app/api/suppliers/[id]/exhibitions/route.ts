import { NextRequest, NextResponse } from 'next/server'
import { mockSuppliers, mockExhibitions } from '@/lib/mock'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supplier = mockSuppliers.find(s => s.id === params.id)

  if (!supplier) {
    return NextResponse.json([], { status: 200 })
  }

  const exhibitions = mockExhibitions.filter(e =>
    e.supplierIds.includes(params.id)
  )

  return NextResponse.json(exhibitions)
}
