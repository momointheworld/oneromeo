'use server'
import { db } from '@/db'
import { redirect } from 'next/navigation'
import paths from '@/components/paths'

export async function deleteResult(id: string) {
    try {
        // Fetch the result
        const result = await db.result.findUnique({
            where: { id },
        })

        if (!result) {
            // Redirect if the result does not exist
            redirect(paths.showAllQuizzes())
        }

        // Delete the result
        await db.result.delete({ where: { id } })

        console.log(`Result ${id} deleted.`)

        // Optionally: Perform additional cleanup if needed
    } catch (error) {
        console.error(`Error deleting result: ${error}`)
    }
}
