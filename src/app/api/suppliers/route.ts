import { NextRequest, NextResponse } from 'next/server'
import { mockSuppliers, addSupplier, updateSupplier, deleteSupplier } from '@/lib/mock'
import { REGION_MAP } from '@/lib/types'

// Helper function for efficient filtering
const matchesRegion = (exportMarkets: string[], region: string): boolean => {
  if (region === 'all') return true
  const regionCountries = REGION_MAP[region] || []
  return exportMarkets.some(market => 
    regionCountries.some(country => market.includes(country) || country.includes(market))
  )
}

// Helper function for search with early termination (searches both en/ko)
const matchesSearch = (supplier: typeof mockSuppliers[0], query: string): boolean => {
  const lowerQuery = query.toLowerCase()
  return (
    supplier.name.toLowerCase().includes(lowerQuery) ||
    supplier.description.en.toLowerCase().includes(lowerQuery) ||
    supplier.description.ko.toLowerCase().includes(lowerQuery) ||
    supplier.capabilities.en.some(c => c.toLowerCase().includes(lowerQuery)) ||
    supplier.capabilities.ko.some(c => c.toLowerCase().includes(lowerQuery))
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  let items = [...mockSuppliers]
  
  // Category filter
  const category = searchParams.get('category')
  if (category && category !== 'All') {
    items = items.filter((s) => s.category === category)
  }
  
  // Region filter with proper mapping
  const region = searchParams.get('region')
  if (region && region !== 'all') {
    items = items.filter((s) => matchesRegion(s.exportMarkets, region))
  }
  
  // Search filter
  const q = searchParams.get('q')
  if (q) {
    items = items.filter((s) => matchesSearch(s, q))
  }
  
  // Pagination
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '12', 10)
  const total = items.length
  const start = (page - 1) * pageSize
  const paged = items.slice(start, start + pageSize)
  
  return NextResponse.json({
    items: paged,
    total,
    page,
    pageSize,
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const supplier = addSupplier(body)
  return NextResponse.json(supplier, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { id, ...data } = body
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  const updated = updateSupplier(id, data)
  if (!updated) return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  const deleted = deleteSupplier(id)
  if (!deleted) return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
