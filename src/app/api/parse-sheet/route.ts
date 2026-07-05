import { NextRequest, NextResponse } from 'next/server'
import { getAdmin } from '@/lib/auth'
import { parseWorkbook } from '@/lib/xlsx'

export const runtime = 'nodejs'

// 업로드된 .xlsx 파일을 문자열 2차원 배열로 파싱해 돌려준다 (매핑은 클라이언트에서)
export async function POST(request: NextRequest) {
  if (!getAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const form = await request.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
  try {
    const buf = Buffer.from(await file.arrayBuffer())
    const rows = await parseWorkbook(buf)
    return NextResponse.json({ rows })
  } catch {
    return NextResponse.json({ error: '엑셀 파일을 읽지 못했습니다.' }, { status: 500 })
  }
}
