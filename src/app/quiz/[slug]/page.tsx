'use client'
import React, { useState, useEffect, useRef } from 'react'
import { getQuiz } from '@/actions'
import { FullSkeleton } from '@/components/common/skeleton-loading'
import {
    Button,
    Card,
    Chip,
    Divider,
    Progress,
    Radio,
    RadioGroup,
    Snippet,
    Spacer,
} from '@nextui-org/react'
import { usePathname } from 'next/navigation'
import PageBreadCrumbs from '@/components/common/breadcrumbs'

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

interface FetchedQuiz {
    id: string
    quizName: string
    questions: QuestionDataProps[]
    results: ResultDataProps[]
}

interface Breadcrumb {
    href: string
    text: string
}

const SingleQuizPage: React.FC = () => {
    const [quiz, setQuiz] = useState<FetchedQuiz | null>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [answers, setAnswers] = useState<Record<string, number>>({})
    const [totalScore, setTotalScore] = useState<number | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false) // Track submission status
    const resultsRef = useRef<HTMLDivElement>(null) // Ref for results section
    const pathname = usePathname() // Get the current pathname

    const breadcrumbs: Breadcrumb[] = [
        { href: '/quiz', text: 'All Quizzes' },
        { href: '/quiz', text: 'Current Quiz' },
    ]
    // Extract quizId from pathname
    const quizId = pathname?.split('/').pop() || ''

    const resultIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-10 text-warning"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082"
            />
        </svg>
    )

    useEffect(() => {
        if (!quizId) return
        const fetchData = async () => {
            try {
                const result = await getQuiz({ id: quizId })
                if (result === null) {
                    setError('Quiz not found or failed to fetch.')
                    return
                }
                setQuiz(result as FetchedQuiz)
            } catch (error) {
                setError('Error fetching quiz data.')
                console.error('Error fetching quiz data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [quizId])

    useEffect(() => {
        if (totalScore !== null && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth' }) // Scroll to results section smoothly
        }
    }, [totalScore])

    const handleAnswerChange = (
        questionId: string,
        answerId: string,
        points: number
    ) => {
        setSelectedAnswer(answerId)
        setAnswers((prev) => ({
            ...prev,
            [questionId]: points,
        }))
    }

    const handleNextClick = () => {
        if (isSubmitted) return // Prevent further actions if already submitted

        if (!selectedAnswer) {
            alert('Please select an answer before proceeding.')
            return
        }

        const nextIndex = currentQuestionIndex + 1
        if (nextIndex < (quiz?.questions.length || 0)) {
            setCurrentQuestionIndex(nextIndex)
            setSelectedAnswer(null) // Reset selected answer for the next question
        } else {
            calculateResult()
            setIsSubmitted(true) // Mark as submitted after final question
        }
    }

    const calculateResult = () => {
        const score = Object.values(answers).reduce(
            (acc, points) => acc + points,
            0
        )
        setTotalScore(score)
    }

    const currentQuestion = quiz?.questions[currentQuestionIndex]
    const answerOptions = ['A', 'B', 'C', 'D']

    // Calculate progress
    const totalQuestions = quiz?.questions.length || 0
    const progress =
        totalQuestions > 0
            ? ((currentQuestionIndex + 1) / totalQuestions) * 100
            : 0

    // Find the full score
    const fullScore = Math.max(
        ...(quiz?.results.map((result) => result.maxPoints) || [0])
    )

    // Find the full score
    const minFullScore = Math.min(
        ...(quiz?.results.map((result) => result.maxPoints) || [0])
    )

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {loading ? (
                <FullSkeleton /> // Display loading skeleton while data is being fetched
            ) : error ? (
                <p className="text-red-500">{error}</p> // Display error message if there was an error fetching data
            ) : (
                <>
                    <PageBreadCrumbs items={breadcrumbs} />
                    <h1 className="text-center text-3xl font-bold mb-6">
                        {quiz?.quizName}
                    </h1>
                    <Progress
                        aria-label="Quiz progress"
                        value={progress}
                        className="mb-6"
                    />
                    {currentQuestion && (
                        <Card isHoverable className="p-6 shadow-md">
                            <h3 className="text-xl font-semibold mb-4">
                                {currentQuestionIndex + 1}:{' '}
                                {currentQuestion.text}
                            </h3>
                            <Spacer y={2} />
                            <div className="flex flex-col gap-4">
                                {currentQuestion.answers
                                    .filter(
                                        (answer) => answer.text.trim() !== ''
                                    ) // Filter out answers with no text
                                    .map((answer, ansIndex) => (
                                        <div
                                            key={answer.id}
                                            className="flex items-center gap-2"
                                        >
                                            <RadioGroup aria-label="Select your favorite city">
                                                <label
                                                    htmlFor={answer.id}
                                                    className="ml-2"
                                                >
                                                    <Radio
                                                        id={answer.id}
                                                        name={`question-${currentQuestion.id}`}
                                                        value={answer.id}
                                                        onChange={() =>
                                                            handleAnswerChange(
                                                                currentQuestion.id,
                                                                answer.id,
                                                                answer.points
                                                            )
                                                        }
                                                    />
                                                    {answerOptions[ansIndex]}:{' '}
                                                    {answer.text}
                                                </label>
                                            </RadioGroup>
                                        </div>
                                    ))}
                            </div>
                            <Spacer y={2} />
                            <Button
                                onClick={handleNextClick}
                                size="lg"
                                color="primary"
                                className="w-full mt-5"
                                isDisabled={isSubmitted} // Disable button if already submitted
                            >
                                {currentQuestionIndex ===
                                (quiz?.questions.length || 0) - 1
                                    ? 'Submit'
                                    : 'Next'}
                            </Button>
                        </Card>
                    )}
                    {totalScore !== null && (
                        <div ref={resultsRef} className="mt-12">
                            <h2 className="text-2xl font-bold flex gap-2">
                                {resultIcon}
                                You scored {totalScore} out of a possible{' '}
                                {fullScore}!
                            </h2>
                            {quiz?.results
                                .filter(
                                    (result) =>
                                        totalScore >= result.minPoints &&
                                        totalScore <= result.maxPoints
                                )
                                .map((result) => (
                                    <div
                                        key={result.id}
                                        className="mt-2 text-lg"
                                    >
                                        {result.resultText}
                                    </div>
                                ))}
                            <Divider className="my-4" />
                            {totalScore <= minFullScore && (
                                <div className="">
                                    <p>
                                        It seems like you need a little help.
                                        Use{' '}
                                        <Chip
                                            radius="sm"
                                            variant="flat"
                                            size="lg"
                                            color="warning"
                                        >
                                            QUIZ24
                                        </Chip>{' '}
                                        at checkout to get 10% off a single
                                        listening session.
                                    </p>
                                    <p className="italic text-gray-600">
                                        Please note: This offer does not apply
                                        to bundle purchases.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default SingleQuizPage
