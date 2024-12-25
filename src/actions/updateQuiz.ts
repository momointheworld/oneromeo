'use server'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import paths from '@/components/paths'

interface UpdateQuizProps {
    quizName: string
    quizIcon: string
    quizDescription: string
}

export async function updateQuiz(id: string, data: UpdateQuizProps) {
    const { quizName, quizIcon, quizDescription } = data
    try {
        const updatedQuiz = await db.quiz.update({
            where: { id },
            data: {
                quizName,
                quizIcon,
                quizDescription,
            },
        })
        console.log(`Quiz updated successfully, redirecting...`, updatedQuiz)
    } catch (error) {
        console.log(`Error updating quiz: ${error}`)
    }
    //  revalidatePath(`/dashboard/quizzes/${id}`);
    //  redirect(`/dashboard/quizzes/${id}`);
    revalidatePath(paths.showSingleQuiz(id))
    redirect(paths.showSingleQuiz(id))
}
