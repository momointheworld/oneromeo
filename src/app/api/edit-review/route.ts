import { NextRequest, NextResponse } from 'next/server'
import { isTokenExpired } from '@/utils/tokenUtils' // Utility to check token expiry
import { db } from '@/db'

export async function PUT(request: NextRequest) {
    const body = await request.json()

    console.log('Received data for review update request:', body)

    const { editLinkToken, rating, comment } = body

    // Validate input
    if (
        !editLinkToken ||
        rating === undefined ||
        rating === null ||
        comment === undefined ||
        comment === null
    ) {
        console.log(
            'Missing required fields: editLinkToken, rating, or comment'
        )
        return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 }
        )
    }

    try {
        // Find the review with the provided token
        const review = await db.review.findUnique({
            where: { editLinkToken },
        })

        if (!review) {
            console.log('Invalid or expired edit link')
            return NextResponse.json(
                { error: 'Invalid or expired edit link' },
                { status: 404 }
            )
        }

        // Check if the token has expired
        if (isTokenExpired(review.editLinkExpiry)) {
            console.log('Edit link has expired')
            return NextResponse.json(
                { error: 'Edit link has expired' },
                { status: 400 }
            )
        }

        // Update the review
        const updatedReview = await db.review.update({
            where: { editLinkToken },
            data: {
                rating,
                comment,
                updatedAt: new Date(),
            },
        })

        console.log('Review updated successfully:', updatedReview)

        return NextResponse.json({
            message: 'Review updated successfully',
            review: updatedReview,
        })
    } catch (error: any) {
        console.error('Error updating review:', error.message)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
