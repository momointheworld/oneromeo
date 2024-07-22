'use client'
import React, { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const ConfirmationPage = () => {
    const searchParams = useSearchParams()
    // const success = searchParams.get('success') === 'true'
    // const session_id = searchParams.get('session_id')

    return (
        <div>
            <h1>Thank you for your payment!</h1>
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
