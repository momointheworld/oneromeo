'use client'
import { Alert } from '@nextui-org/react'
import { useState, useEffect } from 'react'

interface actionProps {
    formStateMessage: string // Initial message to display
    color:
        | 'default'
        | 'primary'
        | 'secondary'
        | 'success'
        | 'warning'
        | 'danger'
        | undefined
}

export default function DisplayMessage({
    formStateMessage,
    color,
}: actionProps) {
    const [messageVisible, setMessageVisible] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (formStateMessage) {
            setMessage(formStateMessage)
            setMessageVisible(true)
        } else {
            setMessage('')
            setMessageVisible(false)
        }
    }, [formStateMessage])

    return (
        messageVisible && (
            <div className="flex flex-wrap max-w-2xl mx-auto">
                <Alert
                    className="rounded-lg text-wrap"
                    color={color || 'warning'}
                >
                    {message}
                </Alert>
            </div>
        )
    )
}
