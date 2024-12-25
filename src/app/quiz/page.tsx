import { db } from '@/db'
import QuizList from '@/components/quizList'
import { Metadata } from 'next'
import { getAllQuizzes } from '@/actions'

export const metadata: Metadata = {
    title: 'Know Yourself Better – Take a Quiz Today!',
    description:
        'Discover more about yourself by taking one (or all) of the quizzes, and – if needed – book a listening session. Ready to get started?',
}

export default async function QuizPage() {
    // const quizzes = await db.quiz.findMany({ orderBy: { date: 'desc' } })
    const quizzes = await getAllQuizzes()

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Know Yourself - Quizzes</h1>
            <QuizList quizzes={quizzes} />
        </div>
    )
}
