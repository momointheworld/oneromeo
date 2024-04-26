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

    const answerOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];


    return (
        <div>
            <div className="my-5">
                <Link href={'/dashboard/'}>Dashboard</Link> {"\u00AB"} <Link href={'/dashboard/quizzes'}>Quizzes</Link> {"\u00AB"} {quiz.quizName}
            </div>
            <div className="flex flex-col items-center">
            <h1>{quiz.quizName}</h1>
            <div className="flex justify-between">
                <div className="flex gap-x-5">
                    <Link href={`/dashboard/quizzes/${quizId}/edit`} className="p-3 border rounded border-blue-400 no-underline hover:bg-blue-400">Edit</Link>
                </div>
            </div>
            <div className="p-2 mt-4">
                <h2>Questions:</h2>
                <div>
                    {questionsWithAnswers.map((questionWithAnswers, index) => (
                        <div key={questionWithAnswers.id}>
                            <p className="font-bold">{index + 1}: {questionWithAnswers.text}</p>
                            <div>
                                {questionWithAnswers.answers.map((answer, ansIndex) => (
                                    <div key={answer.id}>
                                        <span>{answerOptions[ansIndex]}: {answer.text} | {answer.points}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </div>
    )
}
