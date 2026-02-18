import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const settingsPath = path.join(process.cwd(), 'data', 'settings.json')

const defaultSettings = {
  heroBackgroundImage: '/images/bg-hero.svg',
  heroTitle: 'WHERE K-BEAUTY\nMEETS THE\nWORLD',
  heroSubtitle: 'K-Beauty Media Platform',
  heroDescription: 'Connecting Korean beauty brands with global markets through stories, insights, and partnerships. Your trusted media bridge to K-Beauty innovation.'
}

function getSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf-8')
      return { ...defaultSettings, ...JSON.parse(data) }
    }
  } catch (error) {
    console.error('Error reading settings:', error)
  }
  return defaultSettings
}

function saveSettings(settings: any) {
  try {
    const dir = path.dirname(settingsPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
    return true
  } catch (error) {
    console.error('Error saving settings:', error)
    return false
  }
}

export async function GET() {
  const settings = getSettings()
  return NextResponse.json(settings)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const currentSettings = getSettings()
    const newSettings = { ...currentSettings, ...body }
    
    if (saveSettings(newSettings)) {
      return NextResponse.json({ success: true, settings: newSettings })
    } else {
      return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}
