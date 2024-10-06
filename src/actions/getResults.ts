'use server'
import { db } from '@/db'
import { notFound } from 'next/navigation'

interface ResultDataProps {
    id: string
    minPoints: number
    maxPoints: number
    resultText: string
}

export async function getResults(quizId: string): Promise<ResultDataProps[]> {
    try {
        // Fetch results related to the given quizId
        const results = await db.result.findMany({
            where: { quizId },
            orderBy: { minPoints: 'asc' }, // Optional: order results based on points
        })
        if (results.length === 0) {
            throw new Error('No results found for the provided quiz ID.')
        }
        return results
    } catch (error) {
        console.error('Error fetching results:', error)
        throw new Error(`Error fetching results: ${error}`)
    }
}
