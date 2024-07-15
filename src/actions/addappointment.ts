'use server'
import paths from '@/components/paths'
import { db } from '@/db'
import { convertToUserTimezone } from '@/utils/converTimeZone'
import { revertTimeZone } from '@/utils/revertTimeZone'
import { revalidatePath } from 'next/cache'

interface AppointmentData {
    timeZone: string
    date: Date
    timeSlot: string
    email: string
}

export async function addAppointment(formData: AppointmentData) {
    const { timeZone, date, timeSlot, email } = formData
    console.log(timeZone, date, timeSlot, email)

    try {
        const appointment = await db.appointment.create({
            data: {
                timeZone,
                date,
                timeSlot,
                email,
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
