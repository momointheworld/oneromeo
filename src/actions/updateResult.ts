'use server'
import { revalidate } from '@/app/dashboard/page'
import paths from '@/components/paths'
import { db } from '@/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface UpdateResultProps {
    minPoints: number
    maxPoints: number
    resultText: string
}

export async function updateResult(id: string, data: UpdateResultProps) {
    const { minPoints, maxPoints, resultText } = data
    try {
        const updatedResult = await db.result.update({
            where: { id },
            data: {
                minPoints,
                maxPoints,
                resultText,
            },
        })
        console.log(updatedResult)
        // return updatedResult
    } catch (error) {
        throw new Error(`Error updating result: ${error}`)
    }
    //  redirect(`/dashboard/quizzes/${id}`);
    revalidatePath(paths.showSingleQuiz(id))
    redirect(paths.showSingleQuiz(id))
}
