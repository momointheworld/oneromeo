import { NextRequest, NextResponse } from 'next/server'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
        return NextResponse.json(
            { error: 'Session ID is required' },
            { status: 400 }
        )
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        return NextResponse.json(session)
    } catch (error) {
        console.error('Error retrieving Stripe session:', error)
        return NextResponse.json(
            { error: 'Failed to retrieve session' },
            { status: 500 }
        )
    }
}
