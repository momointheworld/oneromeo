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

        const eBookSubject = 'Please help me out! Did you enjoy my eBook?'
        const sessionSubject = 'Please help me out! Did you enjoy your session?'

        const eBookText = `Thank you for purchasing my eBook, Not in a Million Years! \n\nIf you don't mind, please have a quick look and leave a review using the following link: \n${reviewLinkUrl} \n\nNote that this link will expire in 7 days. You know, without your amazing reviews, I can’t pull this off. Like, really. \n\nThank you so much! \n\nArnold`

        const sessionText = `Thank you for using my listening service! \n\nIf you found it helpful, I’d really appreciate it if you could take a moment to leave a review using the following link: \n${reviewLinkUrl} \n\nThis link will expire in 7 days. Your kind words will help me continue offering this service and reach more people who need a listening ear. \n\nThank you times a 1000!\n\nArnold`

        // Send the review link via email
        const subject =
            reviewLink.productName === 'E-book' ? eBookSubject : sessionSubject
        const text =
            reviewLink.productName === 'E-book' ? eBookText : sessionText
        await sendEmail(email, subject, text)

        return NextResponse.json({ message: 'Review link email sent' })
    } catch (err: any) {
        // Log the error
        console.log('Error sending review link:', err.message)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
