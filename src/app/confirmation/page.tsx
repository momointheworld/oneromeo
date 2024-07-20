'use client'
import React, { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { addAppointment } from '@/actions'

const ConfirmationPage = () => {
    const searchParams = useSearchParams()
    const success = searchParams.get('success') === 'true'
    const session_id = searchParams.get('session_id')

    useEffect(() => {
        const addAppointmentAfterPayment = async () => {
            if (success && session_id) {
                try {
                    const session = await fetch(
                        `/api/get-session?session_id=${session_id}`
                    ).then((res) => res.json())

                    const {
                        appointment_date,
                        appointment_timeSlot,
                        appointment_timeZone,
                    } = session.metadata
                    // Split the combined timeSlot back into thTimeSlot and csrTimeSlot
                    const [thTimeSlot, csrTimeSlot] =
                        appointment_timeSlot.split(';')

                    await addAppointment({
                        timeZone: appointment_timeZone,
                        date: appointment_date,
                        thTimeSlot: thTimeSlot,
                        csrTimeSlot: csrTimeSlot,
                        email: session.customer_email,
                    })
                } catch (error) {
                    console.error('Error adding appointment:', error)
                }
            }
        }

        addAppointmentAfterPayment()
    }, [success, session_id])

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
