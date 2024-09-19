'use server'
import { db } from '@/db'

export async function findAppointmentByEmailAndDate(email: string, date: Date) {
    try {
        // Query the database for an appointment with the given email and date
        const appointment = await db.appointment.findFirst({
            where: {
                email: email,
                createdAt: {
                    gte: new Date(date.setHours(0, 0, 0, 0)),
                    lt: new Date(date.setHours(23, 59, 59, 999)),
                },
            },
        })
        return appointment
    } catch (error) {
        console.error('Error finding appointment:', error)
        throw error
    }
}
