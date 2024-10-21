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
            <div className="flex flex-wrap justify-center">
                <p className="rounded-lg capitalize text-wrap p-2 text-warning-600 bg-warning-100">
                    {message}
                </p>
            </div>
        )
    )
}
