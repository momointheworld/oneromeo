import { db } from '@/db'
import { generateReviewToken } from '@/utils/generateReviewToken'

export async function saveCustomerDetailsToDatabase(
    email: string,
    productId: string,
    productName: string,
    stripeCustomerId: string,
    name: string | null = null // Optional parameter with default null
) {
    try {
        // Check if the customer already exists
        const customer = await db.customer.findUnique({
            where: { email },
        })

        // If customer doesn't exist, create a new record
        if (!customer) {
            await db.customer.create({
                data: {
                    email,
                    stripeCustomerId, // Store Stripe customer ID
                    name,
                },
            })
        }

        // Check if the review link already exists for this product and customer
        const existingReviewLink = await db.reviewLink.findFirst({
            where: {
                email,
                productId,
            },
        })

        // If a review link exists, return early
        if (existingReviewLink) {
            console.log(
                'Review link already exists for this product and customer.'
            )
            return
        }

        // Create a new review link record
        const reviewToken = generateReviewToken(email, productId)

        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + 7) // Set expiry date to 7 days from now

        await db.reviewLink.create({
            data: {
                email,
                productId,
                productName,
                token: reviewToken,
                expiryDate,
                status: 'pending', // Initial status
            },
        })

        console.log('Customer details and review link stored successfully.')
    } catch (error) {
        console.error('Error storing customer details for review:', error)
        throw new Error('Error storing customer details for review.')
    }
}
