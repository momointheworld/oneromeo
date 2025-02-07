import { db } from '@/db'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    try {
        // Extract and parse the ID parameter
        const idParam = searchParams.get('id')
        if (!idParam) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            )
        }

        // Convert comma-separated IDs into an array
        const idList = idParam.split(',')

        // Validate and filter valid ObjectIds
        const validIds = idList.filter((id) => ObjectId.isValid(id))

        if (validIds.length === 0) {
            return NextResponse.json(
                { error: 'No valid IDs provided' },
                { status: 400 }
            )
        }

        const reviews = await db.review.findMany({
            where: {
                status: 'approved', // Fetch only approved reviews
            },
            select: {
                rating: true,
                comment: true,
                submittedAt: true,
                reviewLink: {
                    select: {
                        productName: true, // Fetch product name from ReviewLink
                        customer: {
                            select: {
                                name: true, // Fetch customer name
                            },
                        },
                    },
                },
            },
        })

        // Transform the result into the desired format
        const formattedReviews = reviews.map((review) => ({
            productName: review.reviewLink?.productName || 'Unknown Product', // Use productName from reviewLink
            customerName: review.reviewLink?.customer?.name || 'Anonymous',
            rating: review.rating,
            comment: review.comment,
            submittedAt: review.submittedAt?.toISOString(),
        }))

        console.log(formattedReviews)

        return NextResponse.json({ reviews: formattedReviews })
    } catch (error) {
        console.error('Error fetching approved reviews:', error)
        return NextResponse.json(
            { error: 'An error occurred while fetching reviews' },
            { status: 500 }
        )
    }
}
