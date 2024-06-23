'use client'
import { useEffect, useState, useRef } from 'react'

interface actionProps {
    formStateMessage: string // Initial message to display
}

export default function DisplayPostMessage({ formStateMessage }: actionProps) {
    const [messageVisible, setMessageVisible] = useState(false)
    const [message, setMessage] = useState('')
    const errorMessageRef = useRef<HTMLDivElement>(null) // Reference to the error message element

    // Effect to handle message visibility and close button visibility
    useEffect(() => {
        if (formStateMessage) {
            setMessage(formStateMessage)
            setMessageVisible(true)
            // Disable scrolling when message is displayed
            document.body.style.overflow = 'hidden'
            // Scroll to the error message element when it becomes visible
            if (errorMessageRef.current) {
                errorMessageRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })
            }
        } else {
            setMessage('')
            setMessageVisible(false)
            // Re-enable scrolling when message is hidden
            document.body.style.overflow = ''
        }
    }, [formStateMessage])

    // Function to handle closing the message
    const closeMessage = () => {
        setMessage('')
        setMessageVisible(false)
        // Re-enable scrolling when message is closed
        document.body.style.overflow = ''
    }

    return (
        <>
            {messageVisible && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div
                        ref={errorMessageRef}
                        className="bg-zinc-200 text-gray-700 px-5 rounded flex flex-row justify-between"
                    >
                        <p className="self-center">{formStateMessage}</p>
                        <button
                            className="font-bold hover:text-gray-700 ml-3"
                            onClick={closeMessage}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
