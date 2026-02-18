import { NextRequest, NextResponse } from 'next/server'
import { mockAmbassadors } from '@/lib/mock'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    ambassadors: mockAmbassadors
  })
}
