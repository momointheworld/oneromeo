import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/db'
import { Quiz } from '@prisma/client'

// API handler function
export default async function handler(
    req: NextApiRequest, // Type the request
    res: NextApiResponse // Type the response
) {
    try {
        // Fetch quizzes from the database
        const quizzes: Quiz[] = await db.quiz.findMany({
            orderBy: { date: 'desc' },
        })

        // Return quizzes as JSON
        res.status(200).json({ quizzes })
    } catch (error) {
        // Handle errors and return a 500 status code
        res.status(500).json({ error: 'Error fetching quizzes' })
    }
}
