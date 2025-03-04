import { db } from '@/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    try {
        const productName = searchParams.get('product-name')
        const limit = parseInt(searchParams.get('limit') || '10', 10) // Default: 10 per page
        const page = parseInt(searchParams.get('page') || '1', 10) // Default: page 1
        const skip = (page - 1) * limit // Calculate offset

        // Fetch matching ReviewLinks using regex-like filtering
        const reviewLinks = await db.reviewLink.findMany({
            where: productName
                ? {
                      productName: {
                          contains: productName.trim().replace(/[()]/g, ''),
                          mode: 'insensitive',
                      },
                  }
                : {},
            select: {
                id: true,
                productName: true,
            },
        })

        if (reviewLinks.length === 0) {
            return NextResponse.json({ reviews: [], hasMore: false })
        }

        // Get paginated reviews linked to found reviewLinks
        const reviews = await db.review.findMany({
            where: {
                status: 'approved',
                reviewLinkId: { in: reviewLinks.map((rl) => rl.id) },
            },
            select: {
                rating: true,
                comment: true,
                submittedAt: true,
                reviewLink: {
                    select: {
                        productName: true,
                        customer: { select: { name: true } },
                    },
                },
            },
            orderBy: { submittedAt: 'desc' }, // Latest reviews first
            skip,
            take: limit,
        })

        // Get total review count for pagination
        const totalReviews = await db.review.count({
            where: {
                status: 'approved',
                reviewLinkId: { in: reviewLinks.map((rl) => rl.id) },
            },
        })

        const hasMore = skip + limit < totalReviews // Check if more reviews exist

        const formattedReviews = reviews.map((review) => ({
            productName: review.reviewLink?.productName || 'Unknown Product',
            customerName: review.reviewLink?.customer?.name || 'Anonymous',
            rating: review.rating,
            comment: review.comment,
            submittedAt: review.submittedAt?.toISOString(),
        }))

        return NextResponse.json({ reviews: formattedReviews, hasMore })
    } catch (error) {
        console.error('Error fetching approved reviews:', error)
        return NextResponse.json(
            {
                error: 'An error occurred while fetching reviews',
                details:
                    error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}
