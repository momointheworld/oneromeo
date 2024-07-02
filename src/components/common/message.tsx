'use client'
import { Button } from '@nextui-org/react'
import { traceDeprecation } from 'process'
import { useEffect, useRef, useState } from 'react'

interface actionProps {
    actions: () => Promise<FormData> // Function to initialize form state
    formStateMessage: string // Initial message to display
}

// A universal display message function since postMessage has a different props for Post alone.
export default function DisplayMessage({ formStateMessage }: actionProps) {
    const [messageVisible, setMessageVisible] = useState(false)
    const [message, setMessage] = useState('')
    const errorMessageRef = useRef<HTMLDivElement>(null) // Reference to the error message element

    // Effect to handle message visibility and close button visibility
    useEffect(() => {
        if (formStateMessage) {
            setMessage(formStateMessage)
            setMessageVisible(true)
        } else {
            setMessage('')
            setMessageVisible(false)
        }
    }, [formStateMessage])

    // Function to handle closing the message
    const closeMessage = () => {
        setMessage('')
        setMessageVisible(false)
    }
    return (
        messageVisible && (
            <div className="flex flex-wrap gap-4 justify-center my-3">
                <Button
                    color="warning"
                    variant="flat"
                    className="capitalize"
                    onClick={closeMessage}
                >
                    {formStateMessage} &times;
                </Button>
            </div>
        )
    )
}
