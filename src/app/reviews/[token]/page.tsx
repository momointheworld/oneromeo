'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ReviewPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!token) {
            setErrorMessage('Invalid review link')
            return
        }

        try {
            const response = await fetch('/api/review/submit-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, rating, comment }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to submit review')
            }

            const data = await response.json()
            setSuccessMessage('Review submitted successfully!')
        } catch (error: any) {
            setErrorMessage(error.message)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold">Submit Your Review</h1>
            {successMessage && (
                <p className="text-green-600">{successMessage}</p>
            )}
            {errorMessage && <p className="text-red-600">{errorMessage}</p>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                    <label
                        htmlFor="rating"
                        className="block text-sm font-medium"
                    >
                        Rating (1-5)
                    </label>
                    <input
                        id="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="mt-1 block w-full border-gray-300 rounded-md"
                    />
                </div>

                <div>
                    <label
                        htmlFor="comment"
                        className="block text-sm font-medium"
                    >
                        Comment
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Submit Review
                </button>
            </form>
        </div>
    )
}
