'use client'

import { CardSkeleton } from '@/components/common/skeleton-loading'
import TestimonialsComponent from '@/components/testimonialsComponent'
import { Alert, Skeleton } from '@nextui-org/react'
import { useEffect, useState } from 'react'

interface Customer {
    id: string
    name: string
    email: string
    reviewLinks: ReviewLink[]
}

interface ReviewLink {
    token: string
}

function TestimonialsPage() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('/api/get-customers')
                if (!response.ok) {
                    throw new Error(
                        'Failed to fetch customers. Check your network connection and try again.'
                    )
                }
                const data = await response.json()
                setCustomers(data.customers || [])
            } catch (error: any) {
                console.error('Error fetching customers:', error.message)
                setError(
                    'Failed to fetch customers. Check your network connection and try again.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchCustomers()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center space-y-6">
                <Skeleton className="h-3 w-1/3 rounded-lg" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <Alert color="warning" className="flex justify-items-center">
                {error}
            </Alert>
        )
    }

    if (customers.length === 0) {
        return (
            <Alert color="warning" className="flex justify-items-center">
                No customers available. Check your network connection and try
                again.
            </Alert>
        )
    }

    return (
        <div className="testimonials-container">
            <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                What People Say
            </h1>
            <TestimonialsComponent customers={customers} />
        </div>
    )
}

export default TestimonialsPage
