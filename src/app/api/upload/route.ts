import { NextRequest, NextResponse } from 'next/server'
import { getAdmin } from '@/lib/auth'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'image'

// Admin-only image upload → Supabase Storage. Returns a public URL.
export async function POST(request: NextRequest) {
  if (!getAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return NextResponse.json({ error: '이미지 저장소가 설정되지 않았습니다.' }, { status: 500 })
  }

  const form = await request.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: '이미지 파일만 올릴 수 있습니다.' }, { status: 400 })
  }

  // Filename: <keyBase>.<ext> — same key overwrites the old image (upsert)
  const keyBase = ((form.get('key') as string) || `up-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`)
    .replace(/[^a-zA-Z0-9._-]/g, '-')
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const path = `${keyBase}.${ext}`

  const buf = Buffer.from(await file.arrayBuffer())
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': file.type || 'application/octet-stream',
      'x-upsert': 'true', // overwrite existing file with the same name
    },
    body: buf,
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return NextResponse.json({ error: '업로드에 실패했습니다.', detail }, { status: 500 })
  }

  // Cache-busting version param so a replaced image shows immediately
  const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}?v=${Date.now()}`
  return NextResponse.json({ url, path })
}
