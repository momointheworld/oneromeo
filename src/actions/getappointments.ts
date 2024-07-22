'use server'
import { db } from '@/db'
import { notFound } from 'next/navigation'

export const getAppointments = async () => {
    try {
        const appointments = await db.appointment.findMany()

        if (!appointments || appointments.length === 0) {
            return []
        }
        return appointments
    } catch (error) {
        console.error('Error fetching appointments:', error)
        return notFound()
    }
}
