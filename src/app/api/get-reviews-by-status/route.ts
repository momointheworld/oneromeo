import { db } from '@/db'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest) {
    try {
        // Extract search parameters
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'ID is required' },
                { status: 400 }
            )
        }

        // Check if the provided ID is a valid ObjectId
        const isValidObjectId = ObjectId.isValid(id)

        // Fetch reviews based on the id (whether it's an ObjectId or token)
        const reviews = await db.review.findMany({
            where: {
                status: 'approved', // Only fetch approved reviews (optional based on your use case)
            },
            select: {
                rating: true,
                comment: true,
                submittedAt: true,
                reviewLink: {
                    select: {
                        customer: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        })

        // Transform the result to the desired format
        interface Review {
            rating: number
            comment: string
            submittedAt: Date | null
            reviewLink: {
                customer: {
                    name: string | null
                } | null
            }
        }

        interface FormattedReview {
            name: string
            rating: number
            comment: string
            submittedAt?: string
        }

        const formattedReviews: FormattedReview[] = reviews.map(
            (review: Review) => ({
                name: review.reviewLink?.customer?.name || 'Anonymous', // Fallback for customers without a name
                rating: review.rating,
                comment: review.comment,
                submittedAt: review.submittedAt?.toISOString(),
            })
        )

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
