import { NextRequest, NextResponse } from 'next/server'
import { mockArticles } from '@/lib/mock'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const article = mockArticles.find(a => a.slug === params.slug)
  
  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  return NextResponse.json(article)
}
