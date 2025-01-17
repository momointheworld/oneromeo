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

    return reviewData ? (
        isEditing ? (
            // Editing Mode
            <Form validationErrors={errors} onSubmit={onSubmit}>
                <h2>Edit Your Review</h2>
                <label>
                    Rating:
                    {renderStars(true, undefined)} {/* Editable stars */}
                </label>
                <label>Comment:</label>
                <Textarea
                    value={currentComment}
                    onChange={(e) => setCurrentComment(e.target.value)}
                ></Textarea>

                <div className="flex gap-2 self-end">
                    <Button
                        onPress={handleSave}
                        isLoading={loading}
                        variant="solid"
                        color="primary"
                    >
                        Save
                    </Button>
                    <Button variant="flat" onPress={() => setIsEditing(false)}>
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
                <label>Comment: </label>
                {reviewData?.comment ? reviewData.comment : ''}
                <Button
                    variant="bordered"
                    color="success"
                    onPress={() => setIsEditing(true)}
                >
                    Edit Review
                </Button>
            </div>
        )
    ) : (
        // No Review Yet
        <Form validationErrors={errors} onSubmit={onSubmit} className="w-full">
            <h2>Leave a Review</h2>
            <label>
                Rating:
                {renderStars(true, undefined)} {/* Editable stars */}
            </label>
            <label>Comment:</label>
            <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review"
            ></Textarea>
            <Button
                type="submit"
                variant="bordered"
                color="primary"
                className="self-end"
            ></Button>
        </Form>
    )
}

export default ReviewComponent
