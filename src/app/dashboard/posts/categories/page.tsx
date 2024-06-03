'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllCategories } from '@/actions'
import paths from '@/components/paths'
import PageBreadcrumbs from '@/components/common/breadcrumbs'

interface Post {
    id: string
    title: string
    date: Date
}

interface Category {
    id: string
    name: string
    posts: Post[]
}

interface Breadcrumb {
    href: string
    text: string
}

export default function AllCategories(): JSX.Element {
    const [categories, setCategories] = useState<Category[] | null>(null)
    const breadcrumbs: Breadcrumb[] = [
        { href: paths.dashboard(), text: 'Dashboard' },
        { href: paths.showAllPosts(), text: 'Posts' },
        { href: paths.showAllCategories(), text: 'Categories' },
    ]

    useEffect(() => {
        async function fetchCategories() {
            try {
                const categories = await getAllCategories()
                setCategories(categories)
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }
        fetchCategories()
    }, [])

    return (
        <div>
            <PageBreadcrumbs items={breadcrumbs} />
            <h2>All Categories</h2>
            <div className="flex flex-row gap-4 justify-start">
                {categories ? (
                    categories.map((category) => (
                        <div key={category.id}>
                            <Link href={paths.showCategoryPosts(category.id)}>
                                {category.name}
                            </Link>
                        </div>
                    ))
                ) : (
                    <div>Loading categories...</div>
                )}
            </div>
        </div>
    )
}
