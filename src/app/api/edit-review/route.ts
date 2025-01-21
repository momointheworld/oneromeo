import { NextRequest, NextResponse } from 'next/server'
import { isTokenExpired } from '@/utils/tokenUtils' // Utility to check token expiry
import { db } from '@/db'

interface ReviewUpdateRequest {
    editLinkToken: string
    rating: number
    comment: string
}

export async function PUT(request: NextRequest) {
    let body: ReviewUpdateRequest

    try {
        // Parse the request body
        body = await request.json()
    } catch (error) {
        console.error('Failed to parse request body:', error)
        return NextResponse.json(
            { error: 'Invalid JSON payload' },
            { status: 400 }
        )
    }

    console.log('Received data for review update request:', body)

    const { editLinkToken, rating, comment } = body

    // Validate input
    if (!editLinkToken) {
        console.log('Missing editLinkToken')
        return NextResponse.json(
            { error: 'Missing required field: editLinkToken' },
            { status: 400 }
        )
    }
    if (rating === undefined || rating === null || typeof rating !== 'number') {
        console.log('Invalid rating:', rating)
        return NextResponse.json(
            { error: 'Invalid or missing rating. It must be a number.' },
            { status: 400 }
        )
    }
    if (rating < 1 || rating > 5) {
        console.log('Rating out of range:', rating)
        return NextResponse.json(
            { error: 'Rating must be between 1 and 5.' },
            { status: 400 }
        )
    }
    if (!comment || typeof comment !== 'string') {
        console.log('Invalid or missing comment')
        return NextResponse.json(
            { error: 'Invalid or missing comment. It must be a string.' },
            { status: 400 }
        )
    }

    try {
        // Find the review with the provided token
        const review = await db.review.findUnique({
            where: { editLinkToken },
        })

        if (!review) {
            console.log(
                'No review found for the provided token:',
                editLinkToken
            )
            return NextResponse.json(
                { error: 'Invalid or expired edit link' },
                { status: 404 }
            )
        }

        // Check if the token has expired
        if (isTokenExpired(review.editLinkExpiry)) {
            console.log('Edit link has expired for token:', editLinkToken)
            return NextResponse.json(
                { error: 'Edit link has expired' },
                { status: 400 }
            )
        }

        if (review.isFinalized) {
            return NextResponse.json(
                {
                    error: 'Review cannot be updated as it is already finalized.',
                },
                { status: 400 }
            )
        }

        // Update the review
        const updatedReview = await db.review.update({
            where: { editLinkToken, isFinalized: false },
            data: {
                rating,
                comment,
                isFinalized: true,
                updatedAt: new Date(),
            },
        })

        console.log('Review updated successfully:', updatedReview)

        return NextResponse.json(
            {
                ok: true,
                message: 'Review updated successfully',
                review: updatedReview,
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error('Error updating review:', error.message)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
