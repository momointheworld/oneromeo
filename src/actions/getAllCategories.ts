'use server'
import { db } from '@/db'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export const getAllCategories = cache(async () => {
    try {
        const categories = await db.category.findMany({
            include: {
                posts: true,
            },
        })
        return categories
    } catch (error) {
        console.error('Error fetching all categories with posts:', error)
        return notFound()
    }
})
