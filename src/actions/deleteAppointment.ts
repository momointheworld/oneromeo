'use server'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import paths from '@/components/paths'

export async function deleteAppointment(id: string) {
    try {
        await db.appointment.delete({
            where: { id },
        })
        console.log(`Post ${id} is deleted`)
    } catch (error) {
        // Catch any errors that occur during post creation
        console.error(`Error deleting appointment: ${error}`)
    }
    revalidatePath(paths.showAllAppointments())
    redirect(paths.showAllAppointments())
}
