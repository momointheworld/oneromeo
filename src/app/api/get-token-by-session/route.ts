// src/app/api/get-token-by-session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
        return NextResponse.json(
            { error: 'Session ID is required and must be a string.' },
            { status: 400 }
        )
    }

    try {
        // Fetch the token using Prisma (adjust the query as needed)
        const tokenRecord = await db.downloadToken.findUnique({
            where: { sessionId: sessionId },
        })

        if (!tokenRecord) {
            return NextResponse.json(
                { error: 'Token not found.' },
                { status: 404 }
            )
        }

        return NextResponse.json({ token: tokenRecord.token })
    } catch (error) {
        console.error('Error fetching token:', error)
        return NextResponse.json(
            { error: 'Error fetching token' },
            { status: 500 }
        )
    }
}

export const config = {
    api: {
        bodyParser: false, // Disable body parsing for GET requests
    },
}
