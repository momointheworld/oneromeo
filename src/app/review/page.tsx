'use client'
import React, { useEffect } from 'react'
import { Button, Textarea, Form } from '@nextui-org/react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Icon } from '@iconify/react' // Import Icon from Iconify
import { FullSkeleton } from '@/components/common/skeleton-loading'

export default function ReviewPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    console.log('Token from URL:', token)

    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(true) // Initially set loading to true
    const [submitted, setSubmitted] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [reviewData, setReviewData] = useState<any>(null) // Store review or message

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
                        setReviewData(data.review)
                    } else {
                        setReviewData(data.message || 'No review found') // Provide fallback for missing messages
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

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
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
                body: JSON.stringify({ token, rating, comment }),
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

    const renderStars = () => {
        let stars = []
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= (hoveredRating || rating) // Use hovered rating if exists
            stars.push(
                <Icon
                    key={i}
                    icon="iconoir:star"
                    className="cursor-pointer"
                    onClick={() => handleStarClick(i)}
                    onMouseEnter={() => handleStarHover(i)} // Update hovered rating on hover
                    onMouseLeave={handleStarLeave} // Reset when mouse leaves
                    style={{
                        fontSize: '30px',
                        color: isFilled ? 'orange' : 'gray', // Change color based on rating or hover state
                    }}
                />
            )
        }
        return stars
    }
    return (
        <div className="flex flex-col max-w-md mx-auto">
            {/* Show success or error message */}
            {successMessage && (
                <p className="text-green-600">{successMessage}</p>
            )}
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}

            {/* Show the loading skeleton while loading */}
            {loading && !reviewData ? (
                <FullSkeleton /> // Display skeleton while loading
            ) : (
                // Once loading is finished, show review data or the form
                <>
                    {reviewData ? (
                        typeof reviewData === 'string' ? (
                            <p>{reviewData}</p> // No review yet, show message
                        ) : (
                            <>
                                <div>
                                    <h2 className="font-semibold">
                                        Your Review
                                    </h2>
                                    <div>Rating: {reviewData.rating}</div>
                                    <div>Comment: {reviewData.comment}</div>
                                </div>
                                <Button
                                    variant="flat"
                                    onClick={() => alert('Edit functionality')}
                                >
                                    Edit Review
                                </Button>
                            </>
                        )
                    ) : (
                        <div>
                            <h1 className="text-2xl font-bold">
                                Submit Your Review
                            </h1>
                            <Form
                                validationBehavior="native"
                                validationErrors={errors}
                                onReset={() => setSubmitted(null)}
                                onSubmit={onSubmit}
                            >
                                <label className="block text-sm font-medium text-gray-700">
                                    Rating
                                </label>
                                <div className="flex">{renderStars()}</div>

                                <label className="block text-sm font-medium text-gray-700">
                                    Comment
                                </label>
                                <Textarea
                                    id="comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md"
                                    errorMessage="Comment is required. 5 words minimum."
                                />

                                <Button
                                    type="submit"
                                    isLoading={loading}
                                    variant="solid"
                                    color="primary"
                                    className="self-end mt-1"
                                >
                                    Submit Review
                                </Button>
                            </Form>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
