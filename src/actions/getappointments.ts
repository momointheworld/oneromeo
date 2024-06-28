'use server'
import { db } from '@/db'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export const getAppointments = cache(async () => {
    try {
        const appointments = await db.appointment.findMany()

        if (!appointments || appointments.length === 0) {
            return notFound()
        }
        return appointments
    } catch (error) {
        console.error('Error fetching appointments:', error)
        return notFound()
    }
})
