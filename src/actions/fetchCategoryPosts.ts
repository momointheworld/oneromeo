// get posts based on the category
'use server'
import { db } from '@/db'
import { notFound } from 'next/navigation'
import { cache } from 'react'

interface Post {
    id: string
    date: Date
    title: string
    categoryIDs: string[]
}

export const fetchAndGroupPostsByCategory = cache(
    async (): Promise<{ [key: string]: Post[] } | null> => {
        try {
            const posts = await db.post.findMany({
                include: { categories: true },
                orderBy: { date: 'desc' },
            })

            const groupedPosts: { [key: string]: Post[] } = {}
            posts.forEach((post) => {
                post.categories.forEach((category) => {
                    const categoryId = category.id
                    const categoryName = category.name
                    if (!groupedPosts[categoryId]) {
                        groupedPosts[categoryId] = []
                    }
                    // Add the category name to each post object
                    const postWithCategoryName = { ...post, categoryName }
                    groupedPosts[categoryId].push(postWithCategoryName)
                })
            })

            return groupedPosts
        } catch (error) {
            console.error(
                'Error fetching and grouping posts by category:',
                error
            )
            return notFound()
        }
    }
)
