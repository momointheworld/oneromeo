'use server'
import paths from '@/components/paths'
import { db } from '@/db'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'

interface GetQuizProps {
    id: string
}

interface AnswerDataProps {
    id: string
    text: string
    points: number
}

interface QuestionDataProps {
    id: string
    quizId: string
    text: string
    answers: AnswerDataProps[]
}

interface ResultDataProps {
    id: string
    minPoints: number
    maxPoints: number
    resultText: string
}

// Update the interface for fetchedQuiz to include results
interface FetchedQuiz {
    id: string
    quizName: string
    quizDescription: string
    questions: QuestionDataProps[]
    results: ResultDataProps[] // Include results
}

// Define the type for fetchedQuiz in the server action
export const getQuiz = cache(
    async (props: GetQuizProps): Promise<FetchedQuiz | typeof notFound> => {
        console.log('getting single quiz')

        const { id } = props
        const quiz = await db.quiz.findFirst({
            where: { id },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
                results: true, // Include results in the query
            },
        })

        if (!quiz) {
            redirect(paths.showAllQuizzes())
        }

        return quiz as FetchedQuiz // Cast quiz to FetchedQuiz type
    }
)

interface GetQuizBySlugProps {
    slug: string
}

export const getQuizBySlug = cache(
    async (
        props: GetQuizBySlugProps
    ): Promise<FetchedQuiz | typeof notFound> => {
        console.log('getting quiz by slug')

        const { slug } = props
        const quiz = await db.quiz.findFirst({
            where: { slug },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
                results: true, // Include results in the query
            },
        })

        if (!quiz) {
            redirect(paths.showAllQuizzes())
        }

        return quiz as FetchedQuiz // Cast quiz to FetchedQuiz type
    }
)
