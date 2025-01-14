'use client'
import { Button } from '@nextui-org/react'
import { useState } from 'react'

interface SendReviewButtonProps {
    email: string
    linkId: string
    productName: string
    onSuccess: () => void
    onFail: () => void
}

export default function SendReviewButton({
    email,
    linkId,
    productName,
    onSuccess,
    onFail,
}: SendReviewButtonProps) {
    const [loading, setLoading] = useState(false)
    const [color, setColor] = useState<
        'success' | 'default' | 'primary' | 'secondary' | 'warning' | 'danger'
    >('primary')
    const [buttonText, setButtonText] = useState('Send Review Link')

    const handleClick = async () => {
        setLoading(true)

        // Log the data being sent to the server
        console.log('Sending review link with:', {
            email,
            reviewLinkId: linkId,
            productName,
        })

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/send-review-link`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    reviewLinkId: linkId,
                    productName,
                }),
            }
        )

        // Log the response status and body
        console.log('Response status:', response.status)
        const data = await response.json()
        console.log('Response data:', data)

        if (response.ok) {
            // Update the status in the backend to "sent"
            await fetch(
                `${process.env.NEXT_PUBLIC_SITE_URL}/api/update-review-link-status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        reviewLinkId: linkId,
                        status: 'sent',
                    }),
                }
            )

            setLoading(false)
            setColor('success')
            setButtonText('Sent')
            onSuccess() // Notify the parent about the status update
            console.log('Review link sent successfully')
        } else {
            setLoading(false)
            setColor('danger')
            setButtonText('Failed')
            onFail() // Notify the parent about the status update
            console.error('Failed to send review link:', data)
        }
    }

    return (
        <table className="min-w-full table-auto">
            <thead></thead>
            <tbody>
                <tr>
                    <td className="px-4">
                        <Button
                            variant="flat"
                            color={color}
                            isLoading={loading}
                            onClick={handleClick}
                            disabled={loading || buttonText === 'Sent'}
                        >
                            {buttonText}
                        </Button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
