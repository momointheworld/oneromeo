'use server'
import paths from '@/components/paths'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'

interface AppointmentData {
    thDate: Date
    thTime: string
    csrDate: Date
    csrTime: string
    csrTimeZone: string
    utcDate: Date
    utcTime: string
    email: string
    createdAt: Date
}

export async function addAppointment(formData: AppointmentData) {
    const {
        thDate,
        thTime,
        csrDate,
        csrTime,
        csrTimeZone,
        utcDate,
        utcTime,
        email,
        createdAt,
    } = formData
    console.log(
        thDate,
        thTime,
        csrDate,
        csrTime,
        csrTimeZone,
        utcDate,
        utcTime,
        email,
        createdAt
    )

    try {
        const appointment = await db.appointment.create({
            data: {
                thDate,
                thTime,
                csrDate,
                csrTime,
                csrTimeZone,
                utcDate,
                utcTime,
                email,
                createdAt,
            },
        })

        console.log('Appointment created:', appointment)
    } catch (error) {
        console.error('Error creating appointment:', error)
        throw new Error('Failed to create appointment')
    }

    // Example revalidation and redirection (adjust as per your Next.js setup)
    try {
        console.log('appointment created')
        revalidatePath(paths.showAllAppointments())
    } catch (error) {
        console.error('Error redirecting:', error)
        throw new Error('Failed to redirect')
    }
}
