// SendReviewButton.js
'use client'
import { Button } from '@nextui-org/react'
import { useState } from 'react'

interface SendReviewButtonProps {
    customerId: string
    linkId: string
}

export default function SendReviewButton({
    customerId,
    linkId,
}: SendReviewButtonProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)
    const [color, setColor] = useState<
        'success' | 'default' | 'primary' | 'secondary' | 'warning' | 'danger'
    >('primary')
    const [buttonText, setButtonText] = useState('Send Review Link')

    const handleClick = async () => {
        setLoading(true)
        const response = await fetch('/api/sendReviewLink', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customerId, linkId }),
        })

        const data = await response.json()

        if (data.success) {
            setLoading(false)
            setColor('success')
            setButtonText('Sent')
            console.log('Review link sent successfully')
        } else {
            setLoading(false)
            setColor('danger')
            setButtonText('Failed')
            console.error('Failed to send review link')
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
                            onClick={handleClick} // use the bound function
                        >
                            {buttonText}
                        </Button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
