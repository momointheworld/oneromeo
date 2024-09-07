'use server'
import { revalidatePath } from 'next/cache'
import paths from '@/components/paths'
import { db } from '@/db'

export const recordQuizSubmission = async (quizId: string, score: number) => {
    try {
        await db.quizSubmission.create({
            data: {
                quizId,
                score,
            },
        })
        console.log('quiz submission created')
    } catch (error) {
        console.error('Error recording quiz submission:', error)
        throw new Error('Failed to record quiz submission')
    }
    revalidatePath(paths.showAllQuizzes())
}
