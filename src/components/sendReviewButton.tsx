// SendReviewButton.js
'use client'
import { Button } from '@nextui-org/react'

interface SendReviewButtonProps {
    customerId: string
    linkId: string
}

export default function SendReviewButton({
    customerId,
    linkId,
}: SendReviewButtonProps) {
    const handleClick = async () => {
        const response = await fetch('/api/sendReviewLink', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customerId, linkId }),
        })

        const data = await response.json()

        if (data.success) {
            console.log('Review link sent successfully')
        } else {
            console.error('Failed to send review link')
        }
    }

    return (
        <Button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={handleClick} // use the bound function
        >
            Send Review Link
        </Button>
    )
}
