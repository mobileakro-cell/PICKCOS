import { NextRequest, NextResponse } from 'next/server'
import { clearSamples } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

// Admin-only: delete all sample-flagged records (demo data) before going live.
export async function DELETE(request: NextRequest) {
  if (!getAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const count = await clearSamples()
  return NextResponse.json({ success: true, deleted: count })
}
