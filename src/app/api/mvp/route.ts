import { NextRequest, NextResponse } from 'next/server'
import { listAll, getOne, upsertOne } from '@/lib/db'
import { getAdmin } from '@/lib/auth'
import type { MvpState, MvpHistoryEntry } from '@/lib/mvp'

// 관리자 전용. MVP 항목별 상태(완료/수정필요)·세부내용·변경 이력을 관리.
export async function GET(request: NextRequest) {
  if (!getAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const rows = await listAll<MvpState & { id: string }>('mvp')
    const states: Record<string, MvpState> = {}
    for (const r of rows) states[(r as any).id] = r
    return NextResponse.json({ states })
  } catch (error) {
    console.error('MVP list error:', error)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!getAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, status, detail } = await request.json()
    if (!id || (status !== '완료' && status !== '수정필요')) {
      return NextResponse.json({ error: 'Invalid id or status' }, { status: 400 })
    }
    const cur = (await getOne<MvpState & { id: string }>('mvp', id)) || ({} as MvpState)
    const now = new Date().toISOString()
    const entry: MvpHistoryEntry = { status, detail: detail || undefined, at: now }
    const history = [...(cur.history || []), entry]
    const next = { id, status, detail: status === '수정필요' ? (detail || '') : '', updatedAt: now, history }
    await upsertOne('mvp', id, next)
    return NextResponse.json({ ok: true, state: next })
  } catch (error) {
    console.error('MVP update error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
