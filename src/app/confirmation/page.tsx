'use client'
import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const ConfirmationPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const success = searchParams.get('success') === 'true'
    const email = searchParams.get('email')
    const timeSlot = searchParams.get('timeSlot')
    const date = searchParams.get('date')

    // useEffect(() => {
    //     if (!success) {
    //         router.push('/') // Redirect to home page if success is not true
    //     } else {
    //         const fetchCustomerId = async () => {
    //             // Replace this with your actual logic to get the customer ID
    //             const fetchedCustomerId = 'customer-id-placeholder' // Example placeholder
    //             setCustomerId(fetchedCustomerId)

    //             if (fetchedCustomerId) {
    //                 const { url, error } = await createCustomerPortalSession(
    //                     fetchedCustomerId
    //                 )
    //                 if (url) {
    //                     setPortalUrl(url)
    //                 } else {
    //                     setError(
    //                         error || 'Failed to create customer portal session.'
    //                     )
    //                 }
    //             }
    //         }

    //         fetchCustomerId()
    //     }
    // }, [success, router])

    useEffect(() => {
        if (!success) {
            router.push('/') // Redirect to home page if success is not true
        }
    }, [success, router])

    if (!success) {
        return null // Render nothing while redirecting
    }

    // Process timeSlot
    // Decode URL-encoded timeSlot and process it
    const decodedTimeSlot = timeSlot ? decodeURIComponent(timeSlot) : ''
    const [firstTimeSlot, lastTimeSlot] = decodedTimeSlot.split('(')
    const displayTimeSlot = lastTimeSlot
        ? lastTimeSlot.replace(')', '').trim()
        : ''

    const hasAppointment = firstTimeSlot && lastTimeSlot && date

    return (
        <div className="text-center">
            {hasAppointment ? (
                <>
                    <div>
                        <h1>Thanks for that!</h1>
                        <br />
                        We’ll send you a confirmation email soon 😊
                    </div>
                    <table className="mt-14 flex justify-center">
                        <tbody>
                            <tr>
                                <td>
                                    <strong>Your email:</strong>
                                </td>
                                <td>{email}</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Your appointment is on:</strong>
                                </td>
                                <td>{date}</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>Time:</strong>
                                </td>
                                <td>{displayTimeSlot}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            ) : (
                <p>Thanks, it&apos;s much appreciated. Enjoy the read!</p>
            )}
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
