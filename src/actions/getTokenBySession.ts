// /server/actions/getTokenBySession.ts
import { cache } from 'react'
import { db } from '@/db'

interface GetTokenBySessionProps {
    sessionId: string
}

export const getTokenBySession = cache(
    async ({ sessionId }: GetTokenBySessionProps) => {
        console.log('Getting token by session')

        const tokenRecord = await db.downloadToken.findUnique({
            where: {
                sessionId: sessionId,
            },
        })

        if (!tokenRecord) {
            throw new Error('Token not found for the session')
        }

        return tokenRecord.token
    }
)
