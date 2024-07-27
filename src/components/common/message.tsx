// 'use client'
// import { Button } from '@nextui-org/react'
// import { useEffect, useRef, useState } from 'react'

// interface actionProps {
//     actions: () => Promise<FormData> // Function to initialize form state
//     formStateMessage: string // Initial message to display
// }

// // A universal display message function since postMessage has a different props for Post alone.
// export default function DisplayMessage({ formStateMessage }: actionProps) {
//     const [messageVisible, setMessageVisible] = useState(false)
//     const [message, setMessage] = useState('')
//     const messageTimeoutRef = useRef<number | null>(null) // Reference to the timeout ID

//     // Effect to handle message visibility and timeout
//     useEffect(() => {
//         if (formStateMessage) {
//             setMessage(formStateMessage)
//             setMessageVisible(true)

//             // Clear any existing timeout
//             if (messageTimeoutRef.current) {
//                 clearTimeout(messageTimeoutRef.current)
//             }

//             // Set a new timeout to hide the message after 5 seconds
//             messageTimeoutRef.current = window.setTimeout(() => {
//                 setMessage('')
//                 setMessageVisible(false)
//             }, 5000)
//         } else {
//             setMessage('')
//             setMessageVisible(false)
//         }

//         // Cleanup timeout on component unmount
//         return () => {
//             if (messageTimeoutRef.current) {
//                 clearTimeout(messageTimeoutRef.current)
//             }
//         }
//     }, [formStateMessage])

//     // Function to handle closing the message manually
//     // const closeMessage = () => {
//     //     setMessage('')
//     //     setMessageVisible(false)
//     //     if (messageTimeoutRef.current) {
//     //         clearTimeout(messageTimeoutRef.current)
//     //     }
//     // }

//     return (
//         messageVisible && (
//             <div className="flex flex-wrap gap-4 justify-center my-3">
//                 <Button
//                     color="warning"
//                     variant="flat"
//                     className="capitalize"
//                     // onClick={closeMessage}
//                 >
//                     {message} &times;
//                 </Button>
//             </div>
//         )
//     )
// }

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

    // Function to handle closing the message manually
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
                    {message} &times;
                </Button>
            </div>
        )
    )
}
