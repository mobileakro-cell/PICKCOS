import { NextRequest, NextResponse } from 'next/server'
import { mockArticles, addArticle, updateArticle, deleteArticle } from '@/lib/mock'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  let items = [...mockArticles]
  
  const category = searchParams.get('category')
  if (category && category !== 'all') {
    items = items.filter((a) => a.category === category)
  }
  
  const region = searchParams.get('region')
  if (region && region !== 'all') {
    items = items.filter((a) => a.region === region)
  }
  
  const headline = searchParams.get('headline')
  if (headline === 'true') {
    items = items.filter((a) => a.isHeadline === true)
  } else if (headline === 'false') {
    items = items.filter((a) => !a.isHeadline)
  }

  const q = searchParams.get('q')
  if (q) {
    const query = q.toLowerCase()
    items = items.filter((a) =>
      a.title.en.toLowerCase().includes(query) ||
      a.title.ko.toLowerCase().includes(query) ||
      a.summary.en.toLowerCase().includes(query) ||
      a.summary.ko.toLowerCase().includes(query)
    )
  }
  
  // Sort by date descending
  items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '9', 10)
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
  const article = addArticle(body)
  return NextResponse.json(article, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { id, ...data } = body
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  const updated = updateArticle(id, data)
  if (!updated) return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
  const deleted = deleteArticle(id)
  if (!deleted) return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
