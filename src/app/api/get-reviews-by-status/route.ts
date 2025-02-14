// import { db } from '@/db'
// import { NextRequest, NextResponse } from 'next/server'

// export async function GET(req: NextRequest) {
//     const { searchParams } = new URL(req.url)

//     try {
//         const productName = searchParams.get('product-name')
//         console.log('Step 1 - Received productName:', productName)

//         // First, let's check what ReviewLinks exist
//         const reviewLinks = await db.reviewLink.findMany({
//             where: productName
//                 ? {
//                       productName: productName, // Try exact match first
//                   }
//                 : {},
//             select: {
//                 id: true,
//                 productName: true,
//             },
//         })
//         console.log('Step 2 - Found ReviewLinks:', reviewLinks)

//         // Then, let's get reviews that match these ReviewLinks
//         const reviews = await db.review.findMany({
//             where: {
//                 status: 'approved',
//                 ...(productName && {
//                     reviewLinkId: {
//                         in: reviewLinks.map((rl) => rl.id),
//                     },
//                 }),
//             },
//             select: {
//                 rating: true,
//                 comment: true,
//                 submittedAt: true,
//                 reviewLink: {
//                     select: {
//                         productName: true,
//                         customer: {
//                             select: {
//                                 name: true,
//                             },
//                         },
//                     },
//                 },
//             },
//         })

//         console.log('Step 3 - Final reviews query result:', reviews)

//         // If we got no results, let's try a more permissive search
//         if (reviews.length === 0 && productName) {
//             console.log(
//                 'Step 4 - No results with exact match, trying case-insensitive search'
//             )
//             const fallbackReviews = await db.review.findMany({
//                 where: {
//                     status: 'approved',
//                     reviewLink: {
//                         productName: {
//                             equals: productName,
//                             mode: 'insensitive',
//                         },
//                     },
//                 },
//                 select: {
//                     rating: true,
//                     comment: true,
//                     submittedAt: true,
//                     reviewLink: {
//                         select: {
//                             productName: true,
//                             customer: {
//                                 select: {
//                                     name: true,
//                                 },
//                             },
//                         },
//                     },
//                 },
//             })
//             console.log('Step 5 - Fallback search results:', fallbackReviews)

//             if (fallbackReviews.length > 0) {
//                 return NextResponse.json({
//                     reviews: fallbackReviews.map((review) => ({
//                         productName:
//                             review.reviewLink?.productName || 'Unknown Product',
//                         customerName:
//                             review.reviewLink?.customer?.name || 'Anonymous',
//                         rating: review.rating,
//                         comment: review.comment,
//                         submittedAt: review.submittedAt?.toISOString(),
//                     })),
//                 })
//             }
//         }

//         const formattedReviews = reviews.map((review) => ({
//             productName: review.reviewLink?.productName || 'Unknown Product',
//             customerName: review.reviewLink?.customer?.name || 'Anonymous',
//             rating: review.rating,
//             comment: review.comment,
//             submittedAt: review.submittedAt?.toISOString(),
//         }))

//         return NextResponse.json({
//             reviews: formattedReviews,
//             debug: {
//                 searchedProduct: productName,
//                 foundReviewLinks: reviewLinks.length,
//                 reviewLinksDetails: reviewLinks,
//                 finalReviewCount: reviews.length,
//             },
//         })
//     } catch (error) {
//         console.error('Error fetching approved reviews:', error)
//         return NextResponse.json(
//             {
//                 error: 'An error occurred while fetching reviews',
//                 details:
//                     error instanceof Error ? error.message : 'Unknown error',
//             },
//             { status: 500 }
//         )
//     }
// }

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
