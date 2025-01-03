import { db } from '@/db'
import { generateReviewToken } from './generateReviewToken'

export async function storeCustomerDetailsForLaterReview(
    email: string,
    productId: string
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
                    name: 'Customer Name', // Replace with actual customer name if available
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
                productName: 'Product Name Here', // Use the actual product name if available
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
