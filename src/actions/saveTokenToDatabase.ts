import { db } from '@/db'

// Define the type for the token record
interface TokenRecord {
    email: string
    token: string
    expirationDate: Date
}

// Action to save the token to the database
export const saveTokenToDatabase = async (
    email: string,
    token: string
): Promise<void> => {
    // Define the expiration date for the token
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000) // Token valid for 1 hour

    try {
        // Save the token record to the database
        await db.downloadToken.create({
            data: {
                email,
                token,
                expirationDate,
            },
        })
        console.log('Token saved successfully.')
    } catch (error) {
        console.error('Error saving token to database:', error)
        throw new Error('Error saving token to database')
    }
}
