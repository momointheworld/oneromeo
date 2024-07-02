'use client'
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import { getAllCategories, getCategoryPosts } from '@/actions'
import paths from '@/components/paths'
import PageBreadcrumbs from '@/components/common/breadcrumbs'
import { FullSkeleton } from '@/components/common/skeleton-loading'
import { Pagination } from '@nextui-org/react'

interface Post {
    id: string
    title: string
    date: Date
}

interface CategoryProps {
    params: { id: string }
}

interface Category {
    id: string
    name: string
}

interface Breadcrumb {
    href: string
    text: string
}

export default function SingleCategoryPosts({ params }: CategoryProps) {
    const { id } = params
    const [posts, setPosts] = useState<Post[]>([])
    const [categoryName, setCategoryName] = useState<string | null>(null)
    const [categories, setCategories] = useState<Category[] | null>(null)
    const [page, setPage] = useState(1)
    const [totalPosts, setTotalPosts] = useState(0)
    const [loading, setLoading] = useState(false)

    const postsPerPage = 10

    const breadcrumbs: Breadcrumb[] = [
        { href: paths.dashboard(), text: 'Dashboard' },
        { href: paths.showAllPosts(), text: 'Posts' },
        { href: paths.showAllCategories(), text: 'Categories' },
        { href: paths.showCategoryPosts(id), text: `${categoryName}` },
    ]

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            const data = await getCategoryPosts(id, page, postsPerPage)
            setPosts(data.posts || [])
            setTotalPosts(data.totalPosts || 0)
            setLoading(false)
        }
        fetchData()
    }, [id, page])

    useEffect(() => {
        async function fetchCategories() {
            const categoriesArr = await getAllCategories()
            setCategories(categoriesArr)
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        if (categories) {
            const foundCategory = categories.find(
                (category) => category.id === id
            )
            if (foundCategory) {
                setCategoryName(foundCategory.name)
            }
        }
    }, [id, categories])

    const totalPages = Math.ceil(totalPosts / postsPerPage)

    return (
        <div>
            <PageBreadcrumbs items={breadcrumbs} />
            <h2>Posts for {categoryName}</h2>
            {loading ? (
                <div>
                    <FullSkeleton />
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-2 mt-5">
                        {posts.map((post) => (
                            <div key={post.id}>
                                <Link
                                    href={paths.showSinglePost(post.id)}
                                    className="flex justify-between items-center p-2 border rounded no-underline"
                                >
                                    {format(
                                        new Date(post.date),
                                        'MMMM d, yyyy'
                                    )}{' '}
                                    - {post.title}
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-5">
                        <Pagination
                            total={totalPages}
                            initialPage={1}
                            page={page}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                </>
            )}
        </div>
    )
}
