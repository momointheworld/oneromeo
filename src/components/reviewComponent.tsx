import { Form } from '@nextui-org/form'
import { Button, Input, Textarea } from '@nextui-org/react'
import { useState } from 'react'

type ValidationErrors = {
    [key: string]: string
}

interface ReviewData {
    rating: number
    comment: string
}

interface ReviewFormProps {
    reviewData: ReviewData | null
    errors: ValidationErrors
    setSubmitted: (value: any) => void
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    renderStars: (isEditable: boolean, rating?: number) => JSX.Element
    comment: string
    setComment: (value: string) => void
    handleSave: () => void
    loading: boolean
    isEditing: boolean
    setIsEditing: (value: boolean) => void
}
const ReviewComponent = ({
    reviewData,
    errors,
    onSubmit,
    renderStars,
    comment,
    setComment,
    handleSave,
    isEditing,
    setIsEditing,
    loading,
}: ReviewFormProps) => {
    // Initialize the comment state with reviewData.comment when entering edit mode
    const [currentComment, setCurrentComment] = useState(
        reviewData?.comment || ''
    )
    const [rating, setRating] = useState(reviewData?.rating || 5)

    return (
        <div className="flex flex-col gap-5">
            {reviewData ? (
                isEditing ? (
                    // Editing Mode
                    <Form
                        className="flex flex-col gap-3"
                        validationErrors={errors}
                        onSubmit={onSubmit}
                    >
                        <h2>Edit Your Review</h2>
                        <label>
                            Rating:
                            {renderStars(true, undefined)}{' '}
                            {/* Editable stars */}
                        </label>
                        <label>
                            Comment:
                            <Textarea
                                value={currentComment}
                                onChange={(e) =>
                                    setCurrentComment(e.target.value)
                                }
                                className="border p-1 rounded"
                            ></Textarea>
                        </label>
                        <div className="flex gap-2">
                            <Button onPress={handleSave} disabled={loading}>
                                Save
                            </Button>
                            <Button onPress={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                ) : (
                    // View Mode
                    <div className="flex flex-col gap-5">
                        <h2>Your Review</h2>
                        <div className="flex items-center gap-2">
                            <label>
                                Rating:
                                {renderStars(false, reviewData.rating)}{' '}
                                {/* Static stars */}
                            </label>
                        </div>
                        Comment: {reviewData?.comment ? reviewData.comment : ''}
                        <Button onPress={() => setIsEditing(true)}>
                            Edit Review
                        </Button>
                    </div>
                )
            ) : (
                // No Review Yet
                <Form
                    className="flex flex-col gap-3"
                    validationErrors={errors}
                    onSubmit={onSubmit}
                >
                    <h2>Leave a Review</h2>
                    <label>
                        Rating:
                        {renderStars(true, undefined)} {/* Editable stars */}
                    </label>
                    <label>
                        Comment:
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your review"
                            className="border p-1 rounded"
                        ></Textarea>
                    </label>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </Form>
            )}
        </div>
    )
}

export default ReviewComponent
