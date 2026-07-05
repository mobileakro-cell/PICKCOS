import { NextRequest, NextResponse } from 'next/server'
import { getAdmin } from '@/lib/auth'
import { buildTemplateWorkbook, type SheetKind } from '@/lib/xlsx'

export const runtime = 'nodejs'

// 엑셀(.xlsx) 드롭다운 양식 다운로드
export async function GET(request: NextRequest) {
  if (!getAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const kind = (new URL(request.url).searchParams.get('kind') || 'supplier') as SheetKind
  if (kind !== 'supplier' && kind !== 'exhibition') {
    return NextResponse.json({ error: 'invalid kind' }, { status: 400 })
  }
  const buf = await buildTemplateWorkbook(kind)
  const name = kind === 'supplier' ? '공급사_양식.xlsx' : '전시_양식.xlsx'
  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
    },
  })
}
