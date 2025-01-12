// src/actions/fetchCustomersWithReviewLinks.ts
'use server'
import { db } from '@/db'

export async function fetchCustomersWithReviewLinks() {
    return await db.customer.findMany({
        include: {
            reviewLinks: true, // Fetch associated review links
        },
    })
}
