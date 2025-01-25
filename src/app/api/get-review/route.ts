import { db } from '@/db'
import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token')
    // moving it outside of the try catch for dynamic server error handling
    try {
        if (!token) {
            console.log('Missing token in request')
            return NextResponse.json(
                { error: 'Missing token in request' },
                { status: 400 }
            )
        }

        console.log('Fetching review link for token:', token)

        // Find the ReviewLink using the token
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

        // If review is already submitted, return the review data
        if (reviewLink.review) {
            console.log('Review found for token:', token)
            return NextResponse.json({
                review: reviewLink.review, // Send back the review data if it exists
            })
        } else {
            console.log('No review submitted yet for token:', token, reviewLink)
            return NextResponse.json({
                message: 'No review submitted yet for this link',
                review: null,
            })
        }
    } catch (error) {
        console.error('Error while fetching review:', error)
        return NextResponse.json(
            {
                error: 'An error occurred while fetching the review',
            },
            { status: 500 }
        )
    }
}
