import crypto from 'crypto'

export function generateReviewToken(email: string, productId: string): string {
    // Combine email and productId to create a unique string
    const data = `${email}-${productId}`

    // Use a hash function (e.g., SHA-256) to create a token based on the combined data
    const hash = crypto.createHash('sha256').update(data).digest('hex')

    return hash
}
