import { NextRequest, NextResponse } from 'next/server'
import { listAll, insertOne, patchOne, removeOne } from '@/lib/db'
import type { Article } from '@/lib/types'
import { getAdmin } from '@/lib/auth'

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  let items = await listAll<Article>('article')
  
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
  if (!getAdmin(request)) return unauthorized()
  try {
    const body = await request.json()
    const article = await insertOne('article', body)
    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Article create error:', error)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!getAdmin(request)) return unauthorized()
  try {
    const body = await request.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    const updated = await patchOne<Article>('article', id, data)
    if (!updated) return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Article update error:', error)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!getAdmin(request)) return unauthorized()
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    const deleted = await removeOne('article', id)
    if (!deleted) return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Article delete error:', error)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
