'use server'
import { db } from '@/db'

interface CreateResultProps {
    quizId: string
    minPoints: number
    maxPoints: number
    resultText: string
}

export async function createResult(formData: CreateResultProps) {
    const { quizId, minPoints, maxPoints, resultText } = formData

    try {
        // Create the result in the database
        const newResult = await db.result.create({
            data: {
                minPoints,
                maxPoints,
                resultText,
                quiz: {
                    connect: { id: quizId }, // Connect the result to the quiz based on quizId
                },
            },
        })

        console.log(`Result ${newResult.id} created.`)
        return newResult // Return the newly created result
    } catch (error) {
        console.error('Error creating result:', error)
        throw error // Throw the error to handle it in the caller function
    }
}
