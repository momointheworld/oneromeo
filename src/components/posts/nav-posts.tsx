// This component will render all posts on one single page, different from the dashboard/category/post page
// mainly used for the nav bar posts
'use client'
import * as actions from '@/actions'
import parse from 'html-react-parser'
import { useEffect, useState } from 'react'
import { FullSkeleton } from '@/components/common/skeleton-loading'

interface Post {
    id: string
    date: Date
    title: string
    slug: string
    categoryIDs: string[]
    body: string
}

interface Category {
    id: string
    name: string
}

interface PostsByCategoryProps {
    categoryName: string
}

export default function NavbarPosts({ categoryName }: PostsByCategoryProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [fetchedPosts, setFetchedPosts] = useState<Post[]>([])
    const [totalPosts, setTotalPosts] = useState(0)

    useEffect(() => {
        async function fetchCategories() {
            const categoriesArr = await actions.getAllCategories()
            setCategories(categoriesArr || []) // Ensure it's an array
        }
        fetchCategories() // Call fetchCategories to fetch all categories
    }, [])

    useEffect(() => {
        async function fetchPosts() {
            if (categories) {
                const category = categories.find(
                    (category) => category.name === categoryName
                )
                if (category) {
                    const data = await actions.getCategoryPosts(category.id)
                    setFetchedPosts(data.posts || []) // Ensure it's an array
                    setTotalPosts(data.totalPosts || 0)
                }
            }
        }
        fetchPosts()
    }, [categories, categoryName])

    if (fetchedPosts.length < 1) {
        return (
            <div>
                <FullSkeleton />
            </div>
        )
    }
    return (
        <div>
            {/* Render fetched posts here */}
            {fetchedPosts && (
                <div>
                    <article>
                        {fetchedPosts.map((post) => (
                            <div key={post.id}>
                                <h2 className="text-center">{post.title}</h2>
                                {parse(post.body)}
                            </div>
                        ))}
                    </article>
                </div>
            )}
        </div>
    )
}
