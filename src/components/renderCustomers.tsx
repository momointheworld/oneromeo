import React, { useEffect, useState } from 'react'
import SendReviewButton from './sendReviewButton'
import { Button } from '@nextui-org/react'

export interface ReviewLink {
    id: string
    email: string
    productId: string
    productName: string
    token: string
    expiryDate: Date
    status: string
    createdAt: Date
    updatedAt: Date
    review?: {
        rating: number
        comment: string
    }
}

export interface Customer {
    id: string
    email: string
    name: string | null
    stripeCustomerId: string
    createdAt: Date
    updatedAt: Date
    reviewLinks: ReviewLink[]
}

interface RenderCustomersProps {
    customers: Customer[]
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>
}

interface Review {
    id: string
    email: string
    productId: string
    productName: string
    token: string
    expiryDate: string // ISO date string
    status: string
    createdAt: string // ISO date string
    updatedAt: string // ISO date string
    review?: {
        id: string
        email: string
        productId: string
        rating: number
        comment: string
        submittedAt: string // ISO date string
        updatedAt: string // ISO date string
        reviewLinkId: string
        editLinkToken: string
        editLinkExpiry: string // ISO date string
        isFinalized: boolean
        status: string
    }
}

const RenderCustomers: React.FC<
    RenderCustomersProps & { startIndex: number }
> = ({ customers, setCustomers }) => {
    const [loadingReviewId, setLoadingReviewId] = useState<string | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])

    useEffect(() => {
        const fetchReviews = async () => {
            const tokens = customers.flatMap((customer) =>
                customer.reviewLinks.map((link) => link.token)
            )

            try {
                const response = await fetch('/api/get-all-reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tokens }),
                })

                const data = await response.json()
                console.log('Fetched reviews:', data.reviews)
                setReviews(data.reviews)
            } catch (error) {
                console.error('Error fetching reviews:', error)
            }
        }

        fetchReviews()
    }, [customers])

    interface UpdateReviewStatusFunction {
        (reviewId: string, status: 'approved' | 'declined'): Promise<void>
    }
    const updateReviewStatusFunction: UpdateReviewStatusFunction = async (
        reviewId,
        status
    ) => {
        setLoadingReviewId(reviewId) // Set loading state for the specific review
        try {
            const response = await fetch('/api/update-review-status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reviewId, status }),
            })

            if (response.ok) {
                const updatedReview = await response.json()
                console.log('Updated review from API:', updatedReview) // Log the updated review
                updateReviewStatus(reviewId, status) // Trigger re-render with updated status
            } else {
                const errorData = await response.json()
                console.error(
                    'Failed to update review status:',
                    errorData.error
                )
            }
        } catch (error) {
            console.error('Error updating review status:', error)
        } finally {
            setLoadingReviewId(null) // Reset the loading state after request is complete
        }
    }

    const updateReviewLinkStatus = (reviewLinkId: string, status: string) => {
        setCustomers((prevCustomers) =>
            prevCustomers.map((customer) => ({
                ...customer,
                reviewLinks: customer.reviewLinks.map((reviewLink) =>
                    reviewLink.id === reviewLinkId
                        ? { ...reviewLink, status }
                        : reviewLink
                ),
            }))
        )
    }

    const updateReviewStatus = (reviewId: string, status: string) => {
        setReviews((prevReviews) =>
            prevReviews.map((review) =>
                review.review?.id === reviewId
                    ? { ...review, review: { ...review.review, status } }
                    : review
            )
        )
        console.log('Updated reviews:', reviews) // Log reviews to check the state
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">#</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Updated At</th>
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Action</th>
                        <th className="px-4 py-2 text-left">Review</th>
                        <th className="px-4 py-2 text-left">Process Review</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews
                        .sort(
                            (a, b) =>
                                new Date(b.createdAt).getTime() -
                                new Date(a.createdAt).getTime()
                        )
                        .map((review: Review, index: number) => (
                            <tr key={review.id} className="border-t">
                                {/* Index */}
                                <td className="px-4">{index + 1}</td>

                                {/* Customer Email */}
                                <td className="px-4">{review.email}</td>

                                {/* Date */}
                                <td className="px-4">
                                    {new Date(
                                        review.updatedAt
                                    ).toLocaleDateString()}
                                </td>

                                {/* Product Name */}
                                <td className="px-4">
                                    {review.productName || 'Unknown Product'}
                                </td>

                                {/* Review Status */}
                                <td
                                    className={`px-4 ${
                                        review.status
                                            ? {
                                                  sent: 'bg-green-100 text-green-800',
                                                  failed: 'bg-red-100 text-red-800',
                                                  'review submitted':
                                                      'bg-yellow-100 text-yellow-800',
                                              }[review.status] ||
                                              'bg-gray-50 text-gray-800'
                                            : 'bg-gray-50 text-gray-800'
                                    }`}
                                >
                                    {review.status ? (
                                        <p className="text-xs">
                                            Status:{' '}
                                            {review.status === 'approved'
                                                ? 'Approved'
                                                : review.status === 'declined'
                                                ? 'Declined'
                                                : review.status}
                                        </p>
                                    ) : (
                                        <p className="text-xs">
                                            Status: &ndash;
                                        </p>
                                    )}
                                </td>

                                {/* Review Link */}
                                <td className="px-4">
                                    {review.token ? (
                                        <SendReviewButton
                                            email={review.email}
                                            linkId={review.id}
                                            productName={review.productName}
                                            onSuccess={() =>
                                                updateReviewLinkStatus(
                                                    review.id,
                                                    'sent'
                                                )
                                            }
                                            onFail={() =>
                                                updateReviewLinkStatus(
                                                    review.id,
                                                    'failed'
                                                )
                                            }
                                        />
                                    ) : (
                                        'No review link'
                                    )}
                                </td>

                                {/* Rating and Comment */}
                                <td className="px-4">
                                    {review.review ? (
                                        <div>
                                            <p>
                                                <strong>Rating:</strong>{' '}
                                                {review.review.rating || 'N/A'}
                                            </p>
                                            <p>
                                                <strong>Comment:</strong>{' '}
                                                {review.review.comment || 'N/A'}
                                            </p>
                                            <p
                                                className={
                                                    review.review.status ===
                                                    'approved'
                                                        ? 'text-success'
                                                        : review.review
                                                              .status ===
                                                          'declined'
                                                        ? 'text-danger'
                                                        : 'text-primary'
                                                }
                                            >
                                                {review.review.status}
                                            </p>
                                        </div>
                                    ) : (
                                        <p>&ndash;</p>
                                    )}
                                </td>
                                <td className="px-4 flex flex-col gap-1">
                                    <Button
                                        variant="flat"
                                        color="success"
                                        isDisabled={!review.review}
                                        isLoading={
                                            loadingReviewId ===
                                            review.review?.id
                                        } // Button will be loading if this review is being updated
                                        onPress={() => {
                                            updateReviewStatusFunction(
                                                review.review?.id || '',
                                                'approved'
                                            )
                                        }}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="flat"
                                        color="warning"
                                        isDisabled={!review.review}
                                        isLoading={
                                            loadingReviewId ===
                                            review.review?.id
                                        } // Button will be loading if this review is being updated
                                        onPress={() => {
                                            updateReviewStatusFunction(
                                                review.review?.id || '',
                                                'declined'
                                            )
                                        }}
                                    >
                                        Decline
                                    </Button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}

export default RenderCustomers
