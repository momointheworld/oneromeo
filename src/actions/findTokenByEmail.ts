import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function findTokenByEmail(email: string) {
    try {
        const token = await prisma.downloadToken.findUnique({
            where: { email },
        })
        return token
    } catch (error) {
        console.error('Error finding token by email:', error)
        throw new Error('Could not find token')
    }
}
