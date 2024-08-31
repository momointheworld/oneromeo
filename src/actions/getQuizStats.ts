'use server'
import { db } from '@/db'
import { notFound } from 'next/navigation'

export const getQuizStats = async (quizId: string) => {
    try {
        // Fetch average score and total participants from the database
        const averageScoreData = await db.quizSubmission.aggregate({
            _avg: {
                score: true,
            },
            where: {
                quizId: quizId,
            },
        })

        const totalParticipants = await db.quizSubmission.count({
            where: {
                quizId: quizId,
            },
        })

        return {
            averageScore: averageScoreData._avg.score || 0,
            totalParticipants: totalParticipants,
        }
    } catch (error) {
        console.error('Error fetching quiz stats:', error)
        throw new Error('Failed to fetch quiz stats')
    }
}
