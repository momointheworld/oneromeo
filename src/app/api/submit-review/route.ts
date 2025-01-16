import { db } from '@/db'
import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

// Named export for POST method in the app directory
export async function POST(req: NextRequest) {
    try {
        const { token, rating, comment } = await req.json()

        console.log('Received payload:', { token, rating, comment })

        if (!token || !rating || !comment) {
            console.log('Missing required fields:', { token, rating, comment })
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Find the ReviewLink using the token
        console.log('Fetching review link for token:', token)
        const reviewLink = await db.reviewLink.findUnique({
            where: { token },
            include: { review: true },
        })

        if (!reviewLink) {
            console.log('No review link found or expired for token:', token)
            return NextResponse.json(
                { error: 'Invalid or expired review link' },
                { status: 404 }
            )
        }

        if (reviewLink.review) {
            console.log('Review already submitted for token:', token)
            return NextResponse.json(
                { error: 'Review already submitted' },
                { status: 400 }
            )
        }

        console.log('Creating review for:', {
            email: reviewLink.email,
            productId: reviewLink.productId,
        })

        // Create the review
        const review = await db.review.create({
            data: {
                email: reviewLink.email,
                productId: reviewLink.productId,
                rating: parseInt(rating, 10),
                comment,
                submittedAt: new Date(),
                reviewLinkId: reviewLink.id,
                status: 'pending',
                editLinkToken: crypto.randomBytes(32).toString('hex'), // Generate a secure random token
                editLinkExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            },
        })

        console.log('Review created successfully:', review)

        // Update the ReviewLink status
        await db.reviewLink.update({
            where: { id: reviewLink.id },
            data: { status: 'done' },
        })

        console.log('Review link status updated to "done" for token:', token)

        return NextResponse.json({
            message: 'Review submitted successfully',
            review,
        })
    } catch (error) {
        console.error('Error while submitting review:', error)
        return NextResponse.json(
            {
                error: 'An error occurred while submitting the review',
            },
            { status: 500 }
        )
    }
}
