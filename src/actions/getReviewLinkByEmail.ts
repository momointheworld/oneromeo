import { db } from '@/db'
import { cache } from 'react'

interface GetReviewLinkByEmailProps {
    email: string
    reviewLinkId: string
}

export const getReviewLinkByEmail = cache(
    async ({ email, reviewLinkId }: GetReviewLinkByEmailProps) => {
        console.log('Getting review link by email')

        // Fetch the review link along with the customer it belongs to
        const reviewLink = await db.reviewLink.findUnique({
            where: {
                id: reviewLinkId,
            },
            include: {
                customer: true, // Fetch associated customer details
            },
        })

        // Log the retrieved review link and its associated customer
        console.log('Review link:', reviewLink)
        if (reviewLink?.customer) {
            console.log('Associated Customer:', reviewLink.customer)
        }

        // If no review link is found, throw an error
        if (!reviewLink) {
            console.log('No review link found for id:', reviewLinkId)
            throw new Error('Review link not found')
        }

        // Ensure the review link belongs to the correct customer (using email now)
        if (reviewLink.email !== email) {
            console.log('Review link email:', reviewLink.email)
            console.log('Provided email:', email)
            throw new Error(
                'Review link does not belong to the specified email'
            )
        }

        return reviewLink
    }
)
