'use client'
import React, { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Icon } from '@iconify/react' // Import Icon from Iconify
import { FullSkeleton } from '@/components/common/skeleton-loading'
import ReviewComponent from '@/components/reviewComponent'
import { Alert } from '@nextui-org/react'

interface ReviewData {
    editLinkToken: string
    rating: number
    comment: string
}

export default function ReviewPageContent() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    console.log('Token from URL:', token)
    const [isEditing, setIsEditing] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(true) // Initially set loading to true
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [reviewData, setReviewData] = useState<ReviewData | null>(null)
    const [rating, setRating] = useState(5) // State for rating
    const [hoveredRating, setHoveredRating] = useState(0) // State for hover effect
    const router = useRouter()

    useEffect(() => {
        if (token) {
            // Fetch the review data using the token
            setLoading(true) // Start loading when API request is initiated
            fetch(`/api/get-review?token=${token}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! Status: ${response.status}`
                        )
                    }
                    return response.json()
                })
                .then((data) => {
                    if (data.error) {
                        setErrorMessage(data.error)
                        router.push('/submit-review') // Redirect to the review page on error
                    } else if (data.review) {
                        // If review exists, set reviewData with the actual review
                        setReviewData(data.review)
                    } else {
                        // If no review, set reviewData to null (not a string)
                        setReviewData(null)
                    }
                })
                .catch((error) => {
                    console.error('Error fetching review:', error)
                    setErrorMessage('Failed to fetch review data')
                    router.push('/submit-review')
                })
                .finally(() => {
                    setLoading(false) // Set loading to false once the request is complete
                })
        } else {
            router.push('/submit-review') // Redirect to the review page if there's no token
        }
    }, [router, token])

    // Handle case when token is missing
    if (!token) {
        return (
            <div className="flex flex-col max-w-md mx-auto p-5">
                <Alert color={'warning'}>
                    Invalid review link. Please double-check your link for
                    review submission.
                </Alert>
            </div>
        )
    }

    console.log(reviewData)

    const handleReviewSubmit = async (updatedReviewData: ReviewData) => {
        setLoading(true)
        if (!token) {
            const error =
                'Invalid review link: Missing or invalid token in URL.'
            console.error(error)
            setErrorMessage(error)
            return
        }

        // Reset messages before making the request
        setSuccessMessage('')
        setErrorMessage('')

        try {
            const response = await fetch('/api/submit-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token,
                    rating: updatedReviewData.rating,
                    comment: updatedReviewData.comment,
                }),
            })
            // Log the raw response for debugging
            const rawResponse = await response.json()
            console.log('Raw response:', rawResponse)

            if (!response.ok) {
                throw new Error(rawResponse.error || 'Unexpected error')
            }

            // Use rawResponse directly instead of parsing again
            setSuccessMessage('Review submitted successfully!')
            setReviewData(rawResponse.review)
            setLoading(false)
        } catch (error: any) {
            console.error('Error submitting review:', error)
            setErrorMessage(error.message || 'Unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleStarClick = (rating: number) => {
        setRating(rating) // Set the rating when clicked
    }

    const handleStarHover = (rating: number) => {
        setHoveredRating(rating) // Update the hovered rating
    }

    const handleStarLeave = () => {
        setHoveredRating(0) // Reset hover effect when the mouse leaves
    }

    const renderStars = (
        isEditable: boolean,
        displayRating?: number,
        onRatingChange?: (rating: number) => void
    ) => {
        const activeRating = isEditable
            ? hoveredRating || rating
            : displayRating ?? 0

        const stars = []
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= activeRating // Determine if the star should be filled
            stars.push(
                <Icon
                    key={i}
                    icon="iconoir:star"
                    className={isEditable ? 'cursor-pointer' : ''}
                    onClick={
                        isEditable
                            ? () => {
                                  handleStarClick(i) // Update internal rating
                                  if (onRatingChange) onRatingChange(i) // Notify parent of rating change
                              }
                            : undefined
                    }
                    onMouseEnter={
                        isEditable ? () => handleStarHover(i) : undefined
                    }
                    onMouseLeave={isEditable ? handleStarLeave : undefined}
                    style={{
                        fontSize: '30px',
                        color: isFilled ? 'orange' : 'gray', // Change color based on rating or hover state
                    }}
                />
            )
        }
        return <div className="flex star-container">{stars}</div>
    }

    const handleUpdateSubmit = async (reviewData: ReviewData) => {
        setLoading(true)

        try {
            const response = await fetch('/api/edit-review', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    editLinkToken: reviewData?.editLinkToken ?? '',
                    rating: reviewData.rating,
                    comment: reviewData.comment,
                }),
            })

            if (!response.ok) {
                // Handle non-200 responses
                const errorResult = await response.json()
                throw new Error(
                    errorResult.error || 'Failed to update the review'
                )
            }

            const result = await response.json()
            console.log('API Response:', result)

            if (result.ok) {
                setIsEditing(false) // Exit editing mode
                setSuccessMessage(
                    result.message || 'Review updated successfully!'
                )
                setReviewData(result.review) // Update the state with the latest review data
            } else {
                throw new Error(result.error || 'Failed to update the review')
            }
        } catch (error: any) {
            console.error('Error:', error)
            setErrorMessage(
                error.message || 'An error occurred while updating the review.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col max-w-md mx-auto">
            {/* Show success or error message */}
            {successMessage && (
                <Alert color={'success'}>{successMessage}</Alert>
            )}
            {errorMessage && <Alert color={'danger'}>{errorMessage}</Alert>}
            {/* Show the loading skeleton while loading */}
            {loading ? (
                <FullSkeleton /> // Display skeleton while loading
            ) : (
                // Once loading is finished, show review data or the form
                <div className=" md:w-full p-5">
                    <ReviewComponent
                        reviewData={reviewData}
                        errors={errors}
                        onReviewSubmit={handleReviewSubmit}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        onUpdateSubmit={handleUpdateSubmit}
                        renderStars={renderStars}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    )
}
