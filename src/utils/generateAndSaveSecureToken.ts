import { db } from '@/db'
import crypto from 'crypto'

// Helper function to generate a secure token
const generateToken = (): string => {
    return crypto.randomBytes(32).toString('hex') // Example token generation logic
}

// Unified function to generate and save/update a secure download token
export const generateAndSaveSecureToken = async (
    email: string,
    sessionId: string
): Promise<string> => {
    try {
        // Generate the new token and expiration date
        const token = generateToken()
        const expirationDate = new Date(Date.now() + 60 * 60 * 1000) // Token valid for 1 hour

        // Check if an existing token for the email exists
        const existingEmail = await db.downloadToken.findUnique({
            where: { email }, // Find by email
        })

        if (existingEmail) {
            // If the email exists, update the sessionId, token, and expirationDate
            await db.downloadToken.update({
                where: { email }, // Update by email
                data: {
                    sessionId, // Update sessionId
                    token, // Update token
                    expirationDate, // Update expiration date
                },
            })

            console.log('Session ID and token updated for existing email.')
        } else {
            // If the email doesn't exist, create a new record with sessionId, token, and expirationDate
            await db.downloadToken.create({
                data: {
                    email,
                    sessionId, // New sessionId
                    token, // New token
                    expirationDate, // New expiration date
                },
            })

            console.log('Token created successfully for new email.')
        }

        return token
    } catch (error) {
        console.error('Error generating and saving token:', error)
        throw new Error('Error generating and saving token')
    }
}
