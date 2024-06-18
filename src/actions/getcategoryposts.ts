'use server'
import { db } from '@/db'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export const getCategoryPosts = cache(
    async (categoryId: string, page: number = 1, limit: number = 10) => {
        try {
            const skip = (page - 1) * limit

            // Find the total number of posts for the category
            const totalPosts = await db.post.count({
                where: {
                    categoryIDs: {
                        has: categoryId,
                    },
                },
            })

            // Find the posts associated with the category ID with pagination
            const posts = await db.post.findMany({
                where: {
                    categoryIDs: {
                        has: categoryId,
                    },
                },
                orderBy: {
                    date: 'desc',
                },
                skip: skip,
                take: limit,
            })

            return { posts, totalPosts } // Return the posts and total number of posts
        } catch (error) {
            console.error('Error fetching category posts:', error)
            return notFound()
        }
    }
)
