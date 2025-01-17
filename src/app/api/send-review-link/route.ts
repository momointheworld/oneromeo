import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/utils/email' // Import sendEmail
import { getReviewLinkByEmail } from '@/actions'

export async function POST(request: NextRequest) {
    const body = await request.json()

    // Log the incoming request data
    console.log('Received data for review link request:', body)

    const { email, reviewLinkId } = body

    // Validate input
    if (!email || !reviewLinkId) {
        console.log('Missing email or reviewLinkId')
        return NextResponse.json(
            { error: 'Email and reviewLinkId are required' },
            { status: 400 }
        )
    }

    try {
        // Fetch the review link by email and ID
        const reviewLink = await getReviewLinkByEmail({ email, reviewLinkId })

        // Log the fetched review link
        console.log('Fetched review link:', reviewLink)

        const reviewLinkUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/review?token=${reviewLink.token}`

        const subject = `Leave a Review for ${reviewLink.productName}`
        const text = `Thank you for purchasing ${reviewLink.productName}! Please leave a review using the following link: ${reviewLinkUrl}. This link will expire in 7 days.`

        // Send the review link via email
        await sendEmail(email, subject, text)

        return NextResponse.json({ message: 'Review link email sent' })
    } catch (err: any) {
        // Log the error
        console.log('Error sending review link:', err.message)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
