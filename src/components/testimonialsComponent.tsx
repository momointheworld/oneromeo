'use client'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Alert, Skeleton } from '@nextui-org/react'
import { Suspense, useEffect, useState } from 'react'
import { CardSkeleton } from './common/skeleton-loading'

type Review = {
    comment: string
    rating: number
    submittedAt: string
    customerName: string
    productName: string
}

type Customer = {
    id: string
    name: string
    email: string
}

interface TestimonialsComponentProps {
    customers: Customer[]
}

function TestimonialsPage({ customers }: TestimonialsComponentProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchReviews = async () => {
            if (!customers || customers.length === 0) {
                setLoading(false)
                setError('No customers available to fetch reviews.')
                return
            }

            // Extract IDs from customers to query reviews
            const customerIds = customers.map((customer) => customer.id)
            if (customerIds.length === 0) {
                setLoading(false)
                setError('Customer IDs are missing.')
                return
            }

            try {
                const response = await fetch(
                    `/api/get-reviews-by-status?id=${customerIds.join(',')}`
                )
                if (!response.ok) {
                    const errorMessage = await response.text()
                    throw new Error(
                        `Failed to fetch reviews: ${response.status} - ${errorMessage}`
                    )
                }
                const data = await response.json()
                setReviews(data.reviews || [])
            } catch (error: any) {
                console.error('Error fetching reviews:', error)
                setError(error.message || 'Failed to fetch reviews.')
            } finally {
                setLoading(false)
            }
        }
        fetchReviews()
    }, [customers])

    if (loading) {
        return (
            <div className="flex flex-col items-center space-y-6">
                <Skeleton className="h-3 w-1/3 rounded-lg" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
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
                No reviews available at this time.
            </Alert>
        )
    }

    const renderStars = (rating: number) => {
        const stars = []

        // Render filled stars based on rating
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(
                    <Icon
                        key={`filled-${i}`}
                        icon="iconoir:star"
                        style={{
                            fontSize: '30px',
                            color: 'orange', // Filled stars color
                        }}
                    />
                )
            } else {
                stars.push(
                    <Icon
                        key={`empty-${i}`}
                        icon="iconoir:star-outline" // Empty star icon
                        style={{
                            fontSize: '30px',
                            color: 'lightgray', // Empty stars color
                        }}
                    />
                )
            }
        }

        return <div className="flex">{stars}</div>
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="testimonials max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
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
                                    </span>{' '}
                                </div>
                                <div className="flex-grow border-t border-gray-300">
                                    {' '}
                                </div>
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
                                    {' '}
                                    {new Date(
                                        review.submittedAt
                                    ).toLocaleDateString()}
                                </small>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Suspense>
    )
}

export default TestimonialsPage
