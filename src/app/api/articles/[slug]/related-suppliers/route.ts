import { NextRequest, NextResponse } from 'next/server'
import { getSuppliers, listAll } from '@/lib/db'
import type { Article } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const article = (await listAll<Article>('article')).find((a) => a.slug === params.slug)

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  const relatedSupplierIds = article.relatedSuppliers || []
  const suppliers = (await getSuppliers()).filter(s => relatedSupplierIds.includes(s.id))

  return NextResponse.json({ suppliers })
}
