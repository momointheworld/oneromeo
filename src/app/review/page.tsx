'use client'
import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Icon } from '@iconify/react' // Import Icon from Iconify
import { FullSkeleton } from '@/components/common/skeleton-loading'
import ReviewComponent from '@/components/reviewComponent'
import { log } from 'node:console'

interface ReviewData {
    editLinkToken: string
    rating: number
    comment: string
}

export default function ReviewPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    console.log('Token from URL:', token)
    // const [comment, setComment] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(true) // Initially set loading to true
    // const [submitted, setSubmitted] = useState<boolean | null>(null)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [reviewData, setReviewData] = useState<ReviewData | null>(null)
    const [comment, setComment] = useState<string>(reviewData?.comment || '')

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
                })
                .finally(() => {
                    setLoading(false) // Set loading to false once the request is complete
                })
        }
    }, [token])

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
                    editLinkToken: reviewData?.editLinkToken ?? '',
                    rating: updatedReviewData.rating,
                    comment: updatedReviewData.comment,
                }),
            })
            // Log the raw response for debugging
            const rawResponse = await response.json()
            console.log('Raw response:', rawResponse.error)
            if (!response.ok) {
                throw new Error(`${rawResponse.error || 'Unexpected error'}`)
            }

            // Parse JSON only if the response body is not empty
            const data = rawResponse ? JSON.parse(rawResponse) : null
            console.log('Parsed response data:', data)
            setLoading(false)
            setSuccessMessage('Review submitted successfully!')
        } catch (error: any) {
            console.error('Error submitting review:', error)
            setErrorMessage(error.message || 'Unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const [rating, setRating] = useState(5) // State for rating
    const [hoveredRating, setHoveredRating] = useState(0) // State for hover effect

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

    const handleUpdateSubmit = (reviewData: ReviewData) => {
        fetch('/api/edit-review', {
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
            .then((response) => response.json())
            .then((result) => {
                console.log(result)

                if (result.ok) {
                    alert('Review updated successfully')
                    setIsEditing(false) // Exit editing mode
                    // Update the state with the latest review data
                    setReviewData({
                        ...reviewData,
                        rating: reviewData.rating,
                        comment: reviewData.comment,
                        editLinkToken: reviewData?.editLinkToken ?? '',
                    })
                } else {
                    console.error('Error updating review:', result.error)
                }
            })
            .catch((error) => {
                console.error('Error:', error)
                setErrorMessage('An error occurred while updating the review.')
            })
    }

    return (
        <div className="flex flex-col max-w-md mx-auto">
            {/* Show success or error message */}
            {successMessage && (
                <p className="text-green-600">{successMessage}</p>
            )}
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}

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
