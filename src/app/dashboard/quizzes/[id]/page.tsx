import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import paths from '@/components/paths'
import PageBreadcrumbs from '@/components/common/breadcrumbs'

interface ShowQuizProps {
    params: {
        id: string
    }
}

interface Breadcrumb {
    href: string
    text: string
}

export async function generateStaticParams() {
    const quizzes = await db.quiz.findMany()
    return quizzes.map((quiz) => ({
        id: quiz.id,
    }))
}

export default async function SingleQuizPage({ params }: ShowQuizProps) {
    const quizId = params.id
    const quiz = await db.quiz.findFirst({
        where: { id: quizId },
        include: {
            questions: {
                include: {
                    answers: true,
                },
            },
            results: true, // Include results
        },
    })

    if (!quiz) {
        return notFound()
    }

    const answerOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

    const breadcrumbs: Breadcrumb[] = [
        { href: paths.dashboard(), text: 'Dashboard' },
        { href: paths.showAllQuizzes(), text: 'Quizzes' },
        { href: paths.showSingleQuiz(quiz.id), text: `${quiz.quizName}` },
    ]

    return (
        <div>
            <PageBreadcrumbs items={breadcrumbs} />
            <div className="flex flex-col items-center">
                <h1>{quiz.quizName}</h1>
                <div className="flex justify-between">
                    <div className="flex gap-x-5">
                        <Link
                            href={paths.editQuiz(quizId)}
                            className="p-3 border rounded border-blue-400 no-underline hover:bg-blue-400"
                        >
                            Edit
                        </Link>
                    </div>
                </div>
                <div className="p-2 mt-4">
                    <h2>Description: {quiz.quizDescription}</h2>
                    <h2>Questions:</h2>
                    <div>
                        {quiz.questions.map((questionWithAnswers, index) => (
                            <div key={questionWithAnswers.id}>
                                <p className="font-bold">
                                    {index + 1}: {questionWithAnswers.text}
                                </p>
                                <div>
                                    {questionWithAnswers.answers
                                        .filter(
                                            (answer) =>
                                                answer.text.trim() !== ''
                                        ) // Filter out answers with no text
                                        .map((answer, ansIndex) => (
                                            <div key={answer.id}>
                                                <span>
                                                    {answerOptions[ansIndex]}:{' '}
                                                    {answer.text} |{' '}
                                                    {answer.points}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-2 mt-4">
                    <h2>Results:</h2>
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Result</th>
                                <th className="py-2 px-4 border-b">
                                    Min Points
                                </th>
                                <th className="py-2 px-4 border-b">
                                    Max Points
                                </th>
                                <th className="py-2 px-4 border-b">
                                    Result Text
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {quiz.results.map((result, index) => (
                                <tr key={result.id}>
                                    <td className="py-2 px-4 border-b">
                                        Result {index + 1}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {result.minPoints}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {result.maxPoints}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {result.resultText}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
