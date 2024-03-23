import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";

interface ShowQuizProps {
    params: {
        id: string
    }
}

export default async function ShowQuiz(props: ShowQuizProps) {
    // In MongoDB the ID is an object
    const quizId = props.params.id;
    const quiz = await db.quiz.findFirst({
        where: { id: quizId }
    })
    if (!quiz) {
        return notFound();
    }

    const questionsWithAnswers = await db.question.findMany({
        where: { quizId: quizId }, // quizId is the field that links questions to quizzes
        include: { answers: true } // 'answers' is the field that represents the answers related to each question
    })
    if (questionsWithAnswers.length === 0) {
        return notFound();
    }
    return (
        <div>
             <div className="my-5">
             <Link href={'/dashboard/'}>Dashboard</Link> {"\u00AB"} <Link href={'/dashboard/quizzes'}>quizzes</Link> {"\u00AB"} {quiz.quizName}
            </div>
            <h1>{quiz.quizName}</h1>
            <div className="flex justify-between">
                <div className="flex gap-x-5">
                    <Link href={`/dashboard/quizzes/${quizId}/edit`} className="p-3 border rounded border-blue-400 no-underline hover:bg-blue-400">Edit</Link>
                    <Link href={`/dashboard/quizzes/${quizId}/delete`} className="p-3 border rounded border-red-400 no-underline hover:bg-red-200">Delete</Link>
                </div>
            </div>
            <div className="p-2 mt-4">
                <h2>Questions:</h2>
                <ul>
                    {questionsWithAnswers.map((questionWithAnswers) => (
                        <li key={questionWithAnswers.id}>
                            <p>{questionWithAnswers.text}</p>
                            <ul>
                                {questionWithAnswers.answers.map((answer) => (
                                    <li key={answer.id}>
                                        <span>{answer.text} {answer.points}</span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
