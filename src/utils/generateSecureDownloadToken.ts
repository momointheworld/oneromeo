import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const generateSecureDownloadToken = async (email: string) => {
    const token = crypto.randomBytes(20).toString('hex')
    const expirationDate = new Date(Date.now() + 60 * 60 * 1000) // Token valid for 1 hour

    // Save token, expiration date, and fileId to the database
    await prisma.downloadToken.create({
        data: {
            token: token,
            email: email,
            expirationDate: expirationDate,
        },
    })

    return token
}
