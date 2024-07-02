'use server'
import paths from '@/components/paths'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'

interface AppointmentData {
    date: Date
    timeSlot: string
}

export async function addAppointment(formData: AppointmentData) {
    const { date, timeSlot } = formData
    // Handle DateValue | null and convert it to Date if necessary
    const actualDate = date instanceof Date ? date : new Date() // Example conversion logic

    try {
        const appointment = await db.appointment.create({
            data: {
                date,
                timeSlot,
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
