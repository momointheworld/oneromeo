// src/app/api/fetchQuizzes/route.ts
import { db } from '@/db'
import { Quiz } from '@prisma/client'

export async function POST(req: Request) {
    try {
        // Fetch quizzes from the database
        const quizzes: Quiz[] = await db.quiz.findMany({
            orderBy: { date: 'desc' },
        })

        // Return quizzes as JSON
        return new Response(JSON.stringify({ quizzes }), { status: 200 })
    } catch (error) {
        // Handle errors and return a 500 status code
        return new Response(
            JSON.stringify({ error: 'Error fetching quizzes' }),
            { status: 500 }
        )
    }
}
