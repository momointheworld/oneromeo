// src/app/api/send-review-link/route.ts

import { NextResponse } from 'next/server'
import { db } from '@/db'
import { sendEmail } from '@/utils/email'

export async function POST(req: Request) {
    try {
        const { customerId, reviewLinkId } = await req.json()

        // Validate inputs
        if (!customerId || !reviewLinkId) {
            return NextResponse.json(
                { error: 'Missing customerId or reviewLinkId' },
                { status: 400 }
            )
        }

        // Fetch the review link details
        const reviewLink = await db.reviewLink.findUnique({
            where: { id: reviewLinkId },
        })

        if (!reviewLink) {
            return NextResponse.json(
                { error: 'Review link not found' },
                { status: 404 }
            )
        }

        // Logic to send the email with the review link
        const emailSent = await sendEmail(
            reviewLink.email,
            `We'd love your feedback on ${reviewLink.productName}`,
            `Hi,\n\nThank you for purchasing ${
                reviewLink.productName
            }. We'd appreciate your feedback!\n\nClick here to leave your review: ${
                process.env.NEXT_PUBLIC_BASE_URL
            }/review/${reviewLink.token}\n\nThis link will expire on ${new Date(
                reviewLink.expiryDate
            ).toLocaleDateString()}.`
        )

        if (!emailSent) {
            return NextResponse.json(
                { error: 'Failed to send email' },
                { status: 500 }
            )
        }

        // Update the status of the review link to 'sent'
        await db.reviewLink.update({
            where: { id: reviewLinkId },
            data: { status: 'sent' },
        })

        return NextResponse.json({ message: 'Review link sent successfully' })
    } catch (error) {
        console.error('Error sending review link:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
