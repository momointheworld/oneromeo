'use client'
import { Button } from '@nextui-org/react'
import { useState, useEffect } from 'react'

interface actionProps {
    formStateMessage: string // Initial message to display
}

export default function DisplayMessage({ formStateMessage }: actionProps) {
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
            <div className="flex flex-wrap gap-4 justify-center my-3">
                <Button color="warning" variant="flat" className="capitalize">
                    {message}
                </Button>
            </div>
        )
    )
}
