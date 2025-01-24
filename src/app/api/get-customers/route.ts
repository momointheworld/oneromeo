import { db } from '@/db'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const customers = await db.customer.findMany({
            include: {
                reviewLinks: true, // Include review links if needed
            },
        })

        return NextResponse.json({ customers })
    } catch (error) {
        console.error('Error fetching customers:', error)
        return NextResponse.json(
            { error: 'Failed to fetch customers' },
            { status: 500 }
        )
    }
}
