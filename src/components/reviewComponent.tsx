import { Icon } from '@iconify/react/dist/iconify.js'
import { Form } from '@nextui-org/form'
import { Button, Textarea } from '@nextui-org/react'
import { useState } from 'react'

type ValidationErrors = { [key: string]: string }

interface ReviewData {
    rating: number
    comment: string
    editLinkToken: string
    isFinalized?: boolean
}

interface ReviewFormProps {
    reviewData?: ReviewData | null
    errors?: ValidationErrors
    onReviewSubmit: (reviewData: ReviewData) => void
    onUpdateSubmit: (reviewData: ReviewData) => void
    renderStars: (
        isEditable: boolean,
        rating?: number,
        onRatingChange?: (rating: number) => void
    ) => JSX.Element
    loading?: boolean
    isEditing: boolean
    setIsEditing: (value: boolean) => void
}

const ReviewComponent = ({
    reviewData = null,
    errors = {},
    onReviewSubmit,
    onUpdateSubmit,
    renderStars,
    isEditing,
    setIsEditing,
    loading = false,
}: ReviewFormProps) => {
    const [rating, setRating] = useState<number>(reviewData?.rating || 5)
    const [comment, setComment] = useState<string>(reviewData?.comment || '')
    const [editLinkToken, setEditLinkToken] = useState<string>(
        reviewData?.editLinkToken || ''
    )

    const handleRatingChange = (newRating: number) => setRating(newRating)

    const handleCommentChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        console.log(e.target.value)
        setComment(e.target.value)
    }
    console.log(comment)

    return reviewData ? (
        isEditing ? (
            // Editing Mode
            <Form
                validationErrors={errors}
                onSubmit={(e) => {
                    e.preventDefault()
                    onUpdateSubmit({
                        rating,
                        comment,
                        editLinkToken,
                    }) // Pass the updated values
                }}
                className="flex flex-col gap-5"
            >
                <h2 className="self-center">Edit Your Review</h2>
                <label>
                    Rating:
                    {renderStars(true, rating, handleRatingChange)}{' '}
                    {/* Editable stars */}
                </label>
                <label>Comment:</label>
                <Textarea
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Edit your comment"
                />
                <div className="flex gap-2 self-end">
                    <Button
                        isLoading={loading}
                        disabled={loading}
                        variant="solid"
                        color="primary"
                        type="submit"
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
                <h2 className="self-center">Your Review</h2>
                <div className="flex items-center">
                    <label className="font-bold">
                        Rating:
                        {renderStars(false, reviewData.rating)}{' '}
                        {/* Static stars */}
                    </label>
                </div>
                <label className="font-bold">Comment:</label>
                <div>{reviewData.comment || 'No comment provided.'}</div>
                <Button
                    variant="bordered"
                    color="success"
                    onPress={() => setIsEditing(true)}
                    isDisabled={reviewData.isFinalized}
                >
                    Edit Review
                </Button>
            </div>
        )
    ) : (
        // New Review Mode
        <Form
            validationErrors={errors}
            onSubmit={(e) => {
                e.preventDefault()
                onReviewSubmit({
                    rating,
                    comment,
                    editLinkToken,
                }) // Pass the updated values
            }}
            className="flex flex-col gap-5"
        >
            <h2 className="self-center">
                A quick review, please!{' '}
                <Icon
                    icon="emojione-v1:smiling-face-with-smiling-eyes"
                    width="32"
                    height="32"
                    className="inline-block"
                />
            </h2>
            <label>
                Rating:
                {renderStars(true, rating, handleRatingChange)}{' '}
                {/* Editable stars */}
            </label>
            <label>Comment:</label>
            <Textarea
                value={comment}
                onChange={handleCommentChange}
                placeholder="Start typing here!"
            />
            <Button
                type="submit"
                variant="bordered"
                color="primary"
                className="self-end"
            >
                Submit
            </Button>
        </Form>
    )
}

export default ReviewComponent
