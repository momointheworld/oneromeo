import { db } from '@/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { tokens } = await req.json()

        if (!tokens || !Array.isArray(tokens)) {
            return NextResponse.json(
                { error: 'Invalid tokens' },
                { status: 400 }
            )
        }

        const reviews = await db.reviewLink.findMany({
            where: { token: { in: tokens } },
            include: { review: true },
        })

        return NextResponse.json({ reviews })
    } catch (error) {
        console.error('Error fetching all reviews:', error)
        return NextResponse.json(
            { error: 'An error occurred while fetching reviews' },
            { status: 500 }
        )
    }
}
