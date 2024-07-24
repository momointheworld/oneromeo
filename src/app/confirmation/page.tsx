'use client'
import React, { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const ConfirmationPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const success = searchParams.get('success') === 'true'
    const session_id = searchParams.get('session_id')
    const email = searchParams.get('email')
    const appointment = searchParams.get('timeSlot')

    useEffect(() => {
        if (!success) {
            router.push('/') // Redirect to home page if success is not true
        }
    }, [success, router])

    if (!success) {
        return null // Render nothing while redirecting
    }
    return (
        <div>
            <h1>Thank you for your payment!</h1>
            <p>Here is your appointment information:</p>
            <p>{email}</p>
            <p>{appointment}</p>
        </div>
    )
}

export default function ConfirmationPageWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmationPage />
        </Suspense>
    )
}
