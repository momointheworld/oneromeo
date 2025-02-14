import { db } from '@/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    try {
        const productName = searchParams.get('product-name')
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
        //the "productName" is only within reviewlink schema, so it needs to filter from that
        // and then select its id and productname so we can select the reviews related to that reviewLink

        // Get reviews linked to found reviewLinks
        const reviews = await db.review.findMany({
            where: {
                status: 'approved',
                ...(reviewLinks.length > 0 && {
                    reviewLinkId: { in: reviewLinks.map((rl) => rl.id) },
                }),
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
        })

        const formattedReviews = reviews.map((review) => ({
            productName: review.reviewLink?.productName || 'Unknown Product',
            customerName: review.reviewLink?.customer?.name || 'Anonymous',
            rating: review.rating,
            comment: review.comment,
            submittedAt: review.submittedAt?.toISOString(),
        }))

        return NextResponse.json({ reviews: formattedReviews })
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
