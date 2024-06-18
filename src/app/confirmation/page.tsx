'use client'
import { CardSkeleton } from '@/components/common/skeleton-loading'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const OrderConfirmationContent = () => {
    const searchPath = useSearchParams()
    const sessionId = searchPath.get('session_id')

    if (sessionId) {
        return (
            <div>
                Thanks for your order. We will send you an email to confirm the
                date.
                <div>You can visit this page to manage your subscriptions.</div>
            </div>
        )
    } else {
        return <div>No order found!</div>
    }
}

const OrderConfirmation = () => {
    return (
        <Suspense fallback={<CardSkeleton />}>
            <OrderConfirmationContent />
        </Suspense>
    )
}

export default OrderConfirmation
