import { NextRequest, NextResponse } from 'next/server'

interface MatchingRequest {
  id: string
  requestType: string
  category: string
  conceptKeywords: string
  targetMarkets: string[]
  certificationsNeeded: string[]
  moqTarget?: string
  timeline?: string
  ndaNeeded: boolean
  companyName: string
  personName: string
  email: string
  country: string
  preferredChannel: string
  supplierId?: string
  topic?: string
  createdAt: string
}

const matchingRequests: MatchingRequest[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      requestType,
      category,
      conceptKeywords,
      targetMarkets,
      certificationsNeeded,
      moqTarget,
      timeline,
      ndaNeeded,
      companyName,
      personName,
      email,
      country,
      preferredChannel,
      supplierId,
      topic,
    } = body

    // Validation
    if (!requestType || !category || !conceptKeywords || !targetMarkets?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!companyName || !personName || !email || !country || !preferredChannel) {
      return NextResponse.json(
        { error: 'Missing contact information' },
        { status: 400 }
      )
    }

    // Generate request ID
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 5).toUpperCase()
    const requestId = `REQ-${timestamp}-${random}`

    const newRequest: MatchingRequest = {
      id: requestId,
      requestType,
      category,
      conceptKeywords,
      targetMarkets,
      certificationsNeeded,
      moqTarget,
      timeline,
      ndaNeeded,
      companyName,
      personName,
      email,
      country,
      preferredChannel,
      supplierId,
      topic,
      createdAt: new Date().toISOString(),
    }

    matchingRequests.push(newRequest)

    return NextResponse.json(
      { requestId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing matching request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    const recent = matchingRequests.slice(-limit).reverse()

    return NextResponse.json({
      items: recent,
      total: matchingRequests.length,
    })
  } catch (error) {
    console.error('Error fetching matching requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}
