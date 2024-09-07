'use server'
import { db } from '@/db'

interface QuizStats {
    minPoints: number
    maxPoints: number
    count: number
}

export const getQuizStats = async (quizId: string): Promise<QuizStats[]> => {
    try {
        // Fetch results
        const results = await db.result.findMany({
            where: { quizId },
        })

        const stats = await Promise.all(
            results.map(async (result) => {
                const count = await db.quizSubmission.count({
                    where: {
                        quizId,
                        score: {
                            gte: result.minPoints,
                            lte: result.maxPoints,
                        },
                    },
                })
                return {
                    minPoints: result.minPoints,
                    maxPoints: result.maxPoints,
                    count,
                }
            })
        )

        return stats
    } catch (error) {
        console.error('Error fetching quiz stats:', error)
        throw new Error('Failed to fetch quiz stats')
    }
}
