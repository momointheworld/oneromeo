//this is for ebook download token
import { db } from '@/db'
import crypto from 'crypto'

// Helper function to generate a secure token
const generateToken = (): string => {
    return crypto.randomBytes(32).toString('hex') // Example token generation logic
}

// Unified function to generate and save/update a secure download token
export const generateAndSaveSecureToken = async (
    email: string
): Promise<string> => {
    // Generate a secure token
    const token = generateToken()

    // Define the expiration date for the token
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000) // Token valid for 1 hour

    try {
        // Check if a token for the given email already exists
        const existingToken = await db.downloadToken.findUnique({
            where: { email },
        })

        if (existingToken) {
            // Update the existing token
            await db.downloadToken.update({
                where: { email },
                data: {
                    token,
                    expirationDate,
                },
            })
            console.log('Token updated successfully.')
        } else {
            // Create a new token record
            await db.downloadToken.create({
                data: {
                    email,
                    token,
                    expirationDate,
                },
            })
            console.log('Token created successfully.')
        }

        return token
    } catch (error) {
        console.error('Error generating and saving token:', error)
        throw new Error('Error generating and saving token')
    }
}
