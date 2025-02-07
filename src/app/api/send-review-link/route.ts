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

        const reviewLinkUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/submit-review?token=${reviewLink.token}`

        const eBookSubject = 'Enjoyed My eBook?'
        const sessionSubject = 'Enjoyed Our Chat?'

        const sessionText = `Hey there!\n\nDid you enjoy your session?\n\nIf it was helpful, I’d love your review!\n\nJust use this link (expires in 7 days): \n${reviewLinkUrl}\n\nYour feedback helps me keep this service going and support more people.\n\nHuge thanks!\n\nArnold`

        const eBookText = `Hey there!\n\nDid you enjoy Not in a Million Years?\n\nIf so, I’d love your quick review!\n\nJust use this link (expires in 7 days):\n${reviewLinkUrl}\n\nYour support means the world — couldn’t do this without you!\n\nThanks a ton!\n\nArnold`

        // Send the review link via email
        const isEbook = /book/i.test(reviewLink.productName)

        const subject = isEbook ? eBookSubject : sessionSubject
        const text = isEbook ? eBookText : sessionText
        await sendEmail(email, subject, text)

        return NextResponse.json({ message: 'Review link email sent' })
    } catch (err: any) {
        // Log the error
        console.log('Error sending review link:', err.message)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
