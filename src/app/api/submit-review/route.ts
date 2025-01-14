import { db } from '@/db'
import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { token, rating, comment } = req.body

    if (!token || !rating || !comment) {
        return res.status(400).json({ error: 'Missing required fields' })
    }

    try {
        // Find the ReviewLink using the token
        const reviewLink = await db.reviewLink.findUnique({
            where: { token },
            include: { review: true },
        })

        if (!reviewLink) {
            return res
                .status(404)
                .json({ error: 'Invalid or expired review link' })
        }

        if (reviewLink.review) {
            return res.status(400).json({ error: 'Review already submitted' })
        }

        // Create the review
        const review = await db.review.create({
            data: {
                email: reviewLink.email,
                productId: reviewLink.productId,
                // product: { connect: { id: reviewLink.productId } },
                rating: parseInt(rating, 10),
                comment,
                submittedAt: new Date(),
                reviewLinkId: reviewLink.id,
                status: 'pending',
                editLinkToken: crypto.randomBytes(32).toString('hex'), // Generate a secure random token
                editLinkExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            },
        })

        // Update the ReviewLink status
        await db.reviewLink.update({
            where: { id: reviewLink.id },
            data: { status: 'done' },
        })

        res.status(200).json({
            message: 'Review submitted successfully',
            review,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: 'An error occurred while submitting the review',
        })
    }
}
