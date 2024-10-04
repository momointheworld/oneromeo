'use server'
import { db } from '@/db'
import { redirect } from 'next/navigation'
import paths from '@/components/paths'
import { getAnswers } from './getAnswers'

export async function deleteQuestion(id: string) {
    try {
        // Fetch the question and its associated answers
        const question = await db.question.findUnique({
            where: { id },
            include: {
                answers: true,
            },
        })

        if (!question) {
            redirect(paths.showAllQuizzes())
            return
        }

        // Store the questionQuizId
        // const questionQuizId = question.quizId;

        // Delete the associated answers first
        await Promise.all(
            question.answers.map(async (answer) => {
                await db.answer.delete({ where: { id: answer.id } })
                console.log(`Answer ${answer.id} deleted for question ${id}.`)
            })
        )

        // Now delete the question itself
        await db.question.delete({ where: { id } })

        console.log(`Question ${id} is deleted.`)
        await getAnswers(id)
    } catch (error) {
        console.error(`Error deleting question: ${error}`)
    }
}
