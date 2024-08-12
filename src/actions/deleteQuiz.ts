'use server'
import { db } from '@/db'
import { redirect } from 'next/navigation'
import paths from '@/components/paths'
import { revalidatePath } from 'next/cache'

export async function deleteQuiz(id: string) {
    try {
        // Fetch the quiz to check for associated questions and results
        const quiz = await db.quiz.findUnique({
            where: { id },
            include: {
                questions: true,
                results: true,
            },
        })

        if (!quiz) {
            // Redirect if the quiz does not exist
            redirect(paths.showAllQuizzes())
        }

        // Check if there are any questions or results associated with the quiz
        if (quiz.questions.length > 0 || quiz.results.length > 0) {
            console.log(
                `Quiz ${id} cannot be deleted because it has associated questions or results.`
            )
            return
        }

        // Delete the quiz
        await db.quiz.delete({ where: { id } })

        console.log(`Quiz ${id} deleted.`)

        // Optionally: Perform additional cleanup if needed
    } catch (error) {
        console.error(`Error deleting quiz: ${error}`)
    }
    revalidatePath(paths.showAllQuizzes())
    redirect(paths.showAllQuizzes())
}
