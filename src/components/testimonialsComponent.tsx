'use client'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Alert, Button } from '@nextui-org/react'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { CardSkeleton, FullSkeleton } from './common/skeleton-loading'
import { set } from 'zod'

type Review = {
    comment: string
    rating: number
    submittedAt: string
    customerName: string
    productName: string
}

type TestimonialsPageProps = {
    productName?: string // Optional product name for filtering
}

function TestimonialsPage({ productName }: TestimonialsPageProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState<boolean>(true)

    const fetchReviews = useCallback(
        async (currentPage: number) => {
            const isFirstLoad = currentPage === 1
            const limit = isFirstLoad ? 6 : 4 // First load: 6, subsequent: 4

            if (isFirstLoad) {
                setLoading(true) // Initial loading state
            } else {
                setIsLoading(true) // Loading state for "More Reviews"
            }

            try {
                const response = await fetch(
                    `/api/get-reviews-by-status?limit=6&page=${currentPage}${
                        productName
                            ? `&product-name=${encodeURIComponent(productName)}`
                            : ''
                    }`
                )
                if (!response.ok) {
                    const errorMessage = await response.text()
                    throw new Error(
                        `Failed to fetch reviews: ${response.status} - ${errorMessage}`
                    )
                }
                const data = await response.json()

                setReviews((prev) =>
                    currentPage === 1
                        ? data.reviews
                        : [...prev, ...data.reviews]
                )
                setHasMore(data.reviews.length === limit) // Check if more reviews exist
                setError(null)
            } catch (error: any) {
                console.error('Error fetching reviews:', error)
                setError(error.message || 'Failed to fetch reviews.')
            } finally {
                setLoading(false) // Only affects initial load
                setIsLoading(false) // Only affects "More Reviews"
            }
        },
        [productName]
    )

    useEffect(() => {
        // Reset state when product changes
        setPage(1)
        setHasMore(true)
        setLoading(true)
        fetchReviews(1) // No need to reset reviews here, as fetchReviews will replace them for page 1
    }, [productName, fetchReviews])

    const loadMoreReviews = () => {
        const nextPage = page + 1
        setPage(nextPage)
        fetchReviews(nextPage)
    }

    if (loading && reviews.length === 0) {
        return (
            <div className="flex flex-col items-center space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <Alert color="warning" className="flex justify-items-center">
                {error}
            </Alert>
        )
    }

    if (reviews.length === 0) {
        return (
            <Alert color="warning" className="flex justify-items-center">
                No reviews available for the selected product.
            </Alert>
        )
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                    <Icon
                        key={i}
                        icon={
                            i < rating ? 'iconoir:star' : 'iconoir:star-outline'
                        }
                        style={{
                            fontSize: '30px',
                            color: i < rating ? 'orange' : 'lightgray',
                        }}
                    />
                ))}
            </div>
        )
    }

    return (
        <Suspense fallback={<FullSkeleton />}>
            <div className="testimonials max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="review-card p-4 bg-white rounded-lg shadow-md border border-gray-200"
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex-shrink-0">
                                    <span className="text-xl font-semibold text-gray-800 custom-font">
                                        {review.customerName
                                            ? `${
                                                  review.customerName.split(
                                                      ' '
                                                  )[0]
                                              }${
                                                  review.customerName.split(
                                                      ' '
                                                  )[1]
                                                      ? ` ${review.customerName
                                                            .split(' ')[1]
                                                            .charAt(0)}.`
                                                      : ''
                                              }`
                                            : 'Anonymous'}
                                    </span>
                                </div>
                                <div className="flex-grow border-t border-gray-300"></div>
                                <span className="custom-font">
                                    {review.productName}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 mb-4">
                                <span className="text-yellow-500 font-semibold">
                                    {renderStars(review.rating)}
                                </span>
                            </div>
                            <p className="text-gray-700 mb-3">
                                {review.comment}
                            </p>
                            <p className="text-gray-700 text-sm float-right">
                                <small>
                                    {new Date(
                                        review.submittedAt
                                    ).toLocaleDateString()}
                                </small>
                            </p>
                        </div>
                    ))}
                </div>

                {hasMore && (
                    <div className="flex justify-center mt-6">
                        <Button
                            color="primary"
                            onPress={loadMoreReviews}
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'More Reviews'}
                        </Button>
                    </div>
                )}
            </div>
        </Suspense>
    )
}

export default TestimonialsPage
