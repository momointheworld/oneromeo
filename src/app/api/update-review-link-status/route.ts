import { db } from '@/db'
import { NextRequest, NextResponse } from 'next/server'

interface UpdateReviewLinkStatusProps {
    reviewLinkId: string
    status: string
}

export async function PUT(request: NextRequest) {
    const { reviewLinkId, status }: UpdateReviewLinkStatusProps =
        await request.json()

    try {
        const updatedReviewLink = await db.reviewLink.update({
            where: {
                id: reviewLinkId,
            },
            data: {
                status, // Update the status of the review link
            },
        })

        return NextResponse.json({
            message: 'Review link status updated',
            reviewLink: updatedReviewLink,
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to update review link status' },
            { status: 500 }
        )
    }
}
