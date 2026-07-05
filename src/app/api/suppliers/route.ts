import { NextRequest, NextResponse } from 'next/server'
import { getSuppliers, createSupplier, editSupplier, removeSupplier, upsertOne } from '@/lib/db'
import { REGION_MAP, type Supplier } from '@/lib/types'
import { getAdmin } from '@/lib/auth'

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// Helper function for efficient filtering
const matchesRegion = (exportMarkets: string[], region: string): boolean => {
  if (region === 'all') return true
  const regionCountries = REGION_MAP[region] || []
  return exportMarkets.some(market => 
    regionCountries.some(country => market.includes(country) || country.includes(market))
  )
}

// Helper function for search with early termination (searches both en/ko)
const matchesSearch = (supplier: Supplier, query: string): boolean => {
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

  let items = await getSuppliers()
  
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

  // Product category filter (multi-select, comma-separated) — match ANY
  const productsParam = searchParams.get('products')
  if (productsParam) {
    const wanted = productsParam.split(',').filter(Boolean)
    if (wanted.length) {
      items = items.filter((s) => (s.productCategories || []).some((pc) => wanted.includes(pc)))
    }
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
  if (!getAdmin(request)) return unauthorized()
  try {
    const body = await request.json()
    // CSV import sends a 번호(id) → upsert so the number stays a stable key
    if (body.id) {
      await upsertOne('supplier', String(body.id), { ...body, id: String(body.id) })
      return NextResponse.json({ ...body }, { status: 201 })
    }
    const supplier = await createSupplier(body)
    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    console.error('Supplier create error:', error)
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!getAdmin(request)) return unauthorized()
  try {
    const body = await request.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    const updated = await editSupplier(id, data)
    if (!updated) return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Supplier update error:', error)
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!getAdmin(request)) return unauthorized()
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    const deleted = await removeSupplier(id)
    if (!deleted) return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Supplier delete error:', error)
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 })
  }
}
