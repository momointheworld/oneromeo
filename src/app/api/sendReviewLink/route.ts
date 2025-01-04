// pages/api/sendReviewLink.ts

import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/utils/email' // Import sendEmail
import { generateReviewToken } from '@/utils/generateReviewToken' // Generate the review token

const zodSchema = z.object({
    email: z.string().email(),
    productName: z.string(),
})

export async function POST(request: NextRequest) {
    const body = await request.json()
    const parsedBody = zodSchema.safeParse(body)

    if (!parsedBody.success) {
        return NextResponse.json(
            { errors: parsedBody.error.flatten().fieldErrors },
            { status: 400 }
        )
    }

    const { email, productName } = parsedBody.data
    const token = generateReviewToken(email, productName)

    const reviewLink = `${process.env.NEXT_PUBLIC_SITE_URL}/review/${token}`

    const subject = `Leave a Review for ${productName}`
    const text = `Thank you for purchasing ${productName}! Please leave a review using the following link: ${reviewLink}. This link will expire in 7 days.`

    try {
        await sendEmail(email, subject, text)
        return NextResponse.json({ message: 'Review link email sent' })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
