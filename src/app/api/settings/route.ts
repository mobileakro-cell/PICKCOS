import { NextRequest, NextResponse } from 'next/server'
import { getOne, upsertOne } from '@/lib/db'
import { getAdmin } from '@/lib/auth'

const SETTINGS_ID = 'site'

const defaultSettings = {
  heroBackgroundImage: '/images/bg-hero.svg',
  heroTitle: 'WHERE K-BEAUTY\nMEETS THE\nWORLD',
  heroSubtitle: 'K-Beauty Media Platform',
  heroDescription:
    'Connecting Korean beauty brands with global markets through stories, insights, and partnerships. Your trusted media bridge to K-Beauty innovation.',
}

async function getSettings() {
  const saved = await getOne<Record<string, any>>('setting', SETTINGS_ID)
  return { ...defaultSettings, ...(saved || {}) }
}

export async function GET() {
  return NextResponse.json(await getSettings())
}

export async function POST(request: NextRequest) {
  if (!getAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const newSettings = { ...(await getSettings()), ...body }
    await upsertOne('setting', SETTINGS_ID, newSettings)
    return NextResponse.json({ success: true, settings: newSettings })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}
