import { Button, Form, Textarea } from '@nextui-org/react'

interface ReviewFormProps {
    errors: any
    setSubmitted: (value: any) => void
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
    renderStars: () => JSX.Element
    comment: string
    setComment: (value: string) => void
    loading: boolean
}

const ReviewForm = ({
    errors,
    setSubmitted,
    onSubmit,
    renderStars,
    comment,
    setComment,
    loading,
}: ReviewFormProps) => {
    return (
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
    )
}

export default ReviewForm
