import { NextRequest, NextResponse } from 'next/server'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(req: NextRequest) {
    try {
        // Parse customer ID from the request body or session
        const { customerId } = await req.json()
        console.log(`customerID: ${customerId}`)

        if (!customerId) {
            return NextResponse.json(
                { error: 'Customer ID is required' },
                { status: 400 }
            )
        }

        // Create a customer portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: 'http://localhost:3000/confirmation', // URL to return to after exiting the portal
        })

        console.log(`sessionurl: ${session.url}`)
        // Return the URL to the client
        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('Error creating customer portal session:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
