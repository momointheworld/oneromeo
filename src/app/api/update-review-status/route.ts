// app/api/update-review-status/route.ts
import { db } from '@/db'
import { NextRequest, NextResponse } from 'next/server'

interface UpdateReviewStatusProps {
    reviewId: string
    status: string
}

export async function PUT(request: NextRequest) {
    const { reviewId, status }: UpdateReviewStatusProps = await request.json()

    // Check if the review exists
    const review = await db.review.findUnique({
        where: { id: reviewId },
    })

    if (!review) {
        return NextResponse.json(
            { error: `Review with id ${reviewId} not found` },
            { status: 404 }
        )
    }

    if (!reviewId || !status) {
        return NextResponse.json(
            { error: 'ReviewId and status are required' },
            { status: 400 }
        )
    }

    try {
        const updatedReview = await db.review.update({
            where: { id: reviewId },
            data: {
                status,
                updatedAt: new Date(),
            },
        })

        return NextResponse.json({
            message: 'Review status updated',
            review: updatedReview,
        })
    } catch (error) {
        console.error('Error updating review:', error)
        return NextResponse.json(
            { error: 'Failed to update review status' },
            { status: 500 }
        )
    }
}
