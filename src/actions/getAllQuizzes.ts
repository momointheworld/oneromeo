'use server'
import { db } from '@/db'
import { Quiz } from '@prisma/client'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export const getAllQuizzes = cache(async (): Promise<Quiz[]> => {
    const quizzes = await db.quiz.findMany({
        orderBy: { date: 'desc' },
    })

    if (!quizzes || quizzes.length === 0) {
        notFound() // This redirects or throws a 404 if no quizzes are found
    }

    return quizzes
})
