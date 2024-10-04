'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import * as actions from '@/actions'
import DisplayMessage from '@/components/common/message'
import paths from '@/components/paths'
import PageBreadcrumbs from '@/components/common/breadcrumbs'
import { CardSkeleton } from '@/components/common/skeleton-loading'
import { Button, Input, Textarea } from '@nextui-org/react'

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
    results: ResultDataProps[] // Add results to quiz data
}

interface Breadcrumb {
    href: string
    text: string
}

export default function ModifyQuizzes() {
    const [quiz, setQuiz] = useState<FetchedQuiz | null>(null)
    const [questions, setQuestions] = useState<QuestionDataProps[]>([])
    const [answers, setAnswers] = useState<AnswerDataProps[][]>([])
    const [results, setResults] = useState<ResultDataProps[]>([]) // State for results
    const [isAddQLoading, setIsAddQLoading] = useState(false)
    const [isAddResultLoading, setIsAddResultLoading] = useState(false)
    const [isSubmitLoading, setIsSubmitLoading] = useState(false)
    const params = useParams()
    const id = params.id?.toString()
    const [formStateMessage, setFormStateMessage] = useState('')
    const breadcrumbs: Breadcrumb[] = [
        { href: paths.dashboard(), text: 'Dashboard' },
        { href: paths.showAllQuizzes(), text: 'Quizzes' },
        { href: paths.editQuiz(id), text: 'Edit Quiz' },
    ]
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) return

                // Get quiz data
                const fetchedQuiz = await actions.getQuiz({ id })
                setQuiz(fetchedQuiz)

                // Get questions data
                const fetchedQuestions = await actions.getQuestions(id)
                if (fetchedQuestions.length === 0) {
                    setFormStateMessage('No questions found for this quiz.')
                    setQuestions([]) // Ensure questions state is cleared
                    // return // Exit early if no questions are found
                }
                setQuestions(fetchedQuestions)

                // Get results data
                const fetchedResults = await actions.getResults(id)
                if (fetchedResults.length === 0) {
                    setFormStateMessage('No results found for this quiz.')
                    setResults([]) // Ensure results state is cleared
                } else {
                    setResults(fetchedResults) // Set results data if available
                }

                // Loop through questions to get answers for each question
                const allAnswers: AnswerDataProps[][] = []
                for (const question of fetchedQuestions) {
                    const fetchedAnswers = await actions.getAnswers(question.id)
                    allAnswers.push(fetchedAnswers)
                }
                setAnswers(allAnswers)
            } catch (error) {
                console.error('Error fetching data:', error)
                setFormStateMessage(`Error fetching data: ${error}`)
            }
        }

        fetchData()
    }, [id])

    // Update quiz name
    const handleQuizNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (quiz) {
            setQuiz({ ...quiz, quizName: event.target.value })
        }
    }

    // Update question text
    const handleQuestionTextChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedQuestions = [...questions]
        updatedQuestions[index].text = event.target.value
        setQuestions(updatedQuestions)
    }

    // Update answer text
    const handleAnswerTextChange = (
        questionIndex: number,
        answerIndex: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedAnswers = [...answers]
        updatedAnswers[questionIndex][answerIndex].text = event.target.value
        setAnswers(updatedAnswers)
    }

    // Handle selecting points for an answer
    const handleAnswerPointsChange = (
        questionIndex: number,
        answerIndex: number,
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const updatedAnswers = [...answers]
        updatedAnswers[questionIndex][answerIndex].points = parseInt(
            event.target.value
        )
        setAnswers(updatedAnswers)
    }

    // Update result min points
    const handleResultMinPointsChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedResults = [...results]
        updatedResults[index].minPoints = parseInt(event.target.value)
        setResults(updatedResults)
    }

    // Update result max points
    const handleResultMaxPointsChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedResults = [...results]
        updatedResults[index].maxPoints = parseInt(event.target.value)
        setResults(updatedResults)
    }

    // Update result text
    const handleResultTextChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const updatedResults = [...results]
        updatedResults[index].resultText = event.target.value
        setResults(updatedResults)
    }

    const handleAddQuestion = async () => {
        setFormStateMessage('Adding question...')
        setIsAddQLoading(true)
        try {
            const newQuestionData = await actions.createQuestion({
                quizId: quiz?.id || '',
                text: '',
                answers: [
                    { text: '', points: 0 },
                    { text: '', points: 0 },
                    { text: '', points: 0 },
                    { text: '', points: 0 },
                ],
            })
            setIsAddQLoading(false)
            setFormStateMessage(
                'Question added successfully. Close to continue'
            )
            setQuestions((prevQuestions) => [...prevQuestions, newQuestionData])
            setAnswers((prevAnswers) => [
                ...prevAnswers,
                newQuestionData.answers,
            ])
        } catch (error) {
            if (error instanceof Error) {
                setFormStateMessage(error.message)
                setIsAddQLoading(false)
            } else {
                setFormStateMessage('Something went wrong, try again later.')
                setIsAddQLoading(false)
            }
        }
    }

    const handleDeleteQuestion = async (id: string) => {
        setFormStateMessage('Loading...')
        setIsSubmitLoading(true)
        try {
            await actions.deleteQuestion(id)
            setQuestions((prevQuestions) =>
                prevQuestions.filter((question) => question.id !== id)
            )
            setIsSubmitLoading(false)
            setFormStateMessage(
                'Question deleted successfully. Close to continue.'
            )
        } catch (error) {
            console.error('Error deleting a question:', error)
            setFormStateMessage(`Error deleting a question ${error}`)
            setIsSubmitLoading(false)
        }
    }

    const handleAddResult = async () => {
        setFormStateMessage('Adding result...')
        setIsAddResultLoading(true)
        try {
            if (!quiz) {
                throw new Error('Quiz data is not available.')
            }

            // Create a new result using your actions
            const newResultData = await actions.createResult({
                quizId: quiz.id, // Use the current quiz ID
                minPoints: 0, // Default value, can be updated later
                maxPoints: 0, // Default value, can be updated later
                resultText: '', // Default value, can be updated later
            })

            // Update state with the new result
            setResults((prevResults) => [...prevResults, newResultData])

            setFormStateMessage('Result added successfully.')
        } catch (error) {
            if (error instanceof Error) {
                setFormStateMessage(error.message)
            } else {
                setFormStateMessage('Something went wrong, try again later.')
            }
        } finally {
            setIsAddResultLoading(false)
        }
    }

    const handleDeleteResult = async (id: string) => {
        setFormStateMessage('Loading...')
        try {
            await actions.deleteResult(id) // Call your API action to delete the result
            setResults((prevResults) =>
                prevResults.filter((result) => result.id !== id)
            )
            setFormStateMessage(
                'Result deleted successfully. Close to continue.'
            )
        } catch (error) {
            console.error('Error deleting a result:', error)
            setFormStateMessage(`Error deleting a result ${error}`)
        }
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setFormStateMessage('Updating quiz...')
        setIsSubmitLoading(true)
        try {
            if (!quiz) {
                throw new Error('Quiz data is not available.')
            }

            // Update answers
            await Promise.all(
                answers.flat().map(async (answer) => {
                    if (answer.id) {
                        await actions.updateAnswer(answer.id, {
                            text: answer.text,
                            points: answer.points,
                        })
                    }
                })
            )

            // Update questions
            await Promise.all(
                questions.map(async (question) => {
                    if (question.id) {
                        await actions.updateQuestion(question.id, {
                            text: question.text,
                        })
                    }
                })
            )

            // Update results
            await Promise.all(
                results.map(async (result) => {
                    if (result.id) {
                        await actions.updateResult(result.id, {
                            minPoints: result.minPoints,
                            maxPoints: result.maxPoints,
                            resultText: result.resultText,
                        })
                    }
                })
            )
            setIsSubmitLoading(false)
            setFormStateMessage('Quiz data updated successfully...reloading')
            // Update quiz
            await actions.updateQuiz(id, { quizName: quiz.quizName })
        } catch (error) {
            console.error('Error updating data:', error)
            setIsSubmitLoading(false)
            setFormStateMessage(
                'Failed to update quiz data, please refresh the page!'
            )
        }
    }

    const handleQuizDelete = async () => {
        if (!quiz) {
            setFormStateMessage('No quiz data available to delete.')
            return
        }

        // Check if there are associated questions or results
        if (questions.length > 0 || results.length > 0) {
            setFormStateMessage(
                'Quiz cannot be deleted because it has associated questions or results.'
            )
            return
        }

        // Confirm deletion
        if (
            !confirm(
                'Are you sure you want to delete this quiz? This action cannot be undone.'
            )
        ) {
            return
        }

        setFormStateMessage('Deleting quiz...')
        setIsSubmitLoading(true)

        try {
            // Call the API action to delete the quiz
            await actions.deleteQuiz(quiz.id)
        } catch (error) {
            console.error('Error deleting the quiz:', error)
            setFormStateMessage(
                error instanceof Error ? error.message : 'Error deleting quiz.'
            )
        } finally {
            setIsSubmitLoading(false)
        }
    }

    if (!quiz || !questions || !answers || !results) {
        return (
            <div className="gap-3">
                <CardSkeleton />
            </div>
        )
    }
    return (
        <>
            <PageBreadcrumbs items={breadcrumbs} />

            <div className="flex justify-center">
                <div className="flex flex-col justify-center lg:w-2/3 md:w-full content-evenly">
                    {/* Quiz title */}
                    {quiz && (
                        <div className="flex flex-row">
                            <label className="text-nowrap self-center">
                                Quiz Name:
                            </label>
                            <input
                                type="text"
                                value={quiz.quizName}
                                className="border rounded p-2 mx-5 w-full"
                                onChange={handleQuizNameChange}
                            />
                        </div>
                    )}
                    {/* Questions */}
                    {questions.map((question, questionIndex) => (
                        <div
                            key={question.id}
                            className="flex flex-col justify-between my-5 p-5 border-slate-300 bg-slate-200 rounded"
                        >
                            <div className="flex font-bold">
                                <label className="text-nowrap px-2 self-center">
                                    Question {questionIndex + 1}:
                                </label>
                                <input
                                    type="text"
                                    value={question.text}
                                    className="border rounded p-2 mx-5 w-full"
                                    onChange={(e) =>
                                        handleQuestionTextChange(
                                            questionIndex,
                                            e
                                        )
                                    }
                                />
                            </div>
                            {/* Answers */}
                            {answers[questionIndex]?.map(
                                (answer, answerIndex) => (
                                    <div
                                        key={answer.id}
                                        className="flex flex-row my-2 p-3 rounded"
                                    >
                                        <label className="text-nowrap px-2 content-evenly">
                                            {String.fromCharCode(
                                                65 + answerIndex
                                            )}
                                            :
                                        </label>
                                        <Textarea
                                            type="text"
                                            value={answer.text}
                                            className="border rounded p-2 mx-5"
                                            classNames={{
                                                base: 'max-w-full',
                                                input: 'resize-y min-h-[40px]',
                                            }}
                                            onChange={(e) =>
                                                handleAnswerTextChange(
                                                    questionIndex,
                                                    answerIndex,
                                                    e
                                                )
                                            }
                                        />
                                        <select
                                            value={answer.points}
                                            className="border rounded p-2"
                                            onChange={(e) =>
                                                handleAnswerPointsChange(
                                                    questionIndex,
                                                    answerIndex,
                                                    e
                                                )
                                            }
                                        >
                                            {[
                                                answer.points,
                                                ...[0, 5, 10, 15].filter(
                                                    (option) =>
                                                        option !== answer.points
                                                ),
                                            ].map((option, index) => (
                                                <option
                                                    key={index}
                                                    value={option}
                                                >
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )
                            )}
                            {/* Delete question button */}
                            <Button
                                onClick={() =>
                                    handleDeleteQuestion(question.id)
                                }
                                color="danger"
                                variant="ghost"
                            >
                                Delete Question
                            </Button>
                        </div>
                    ))}
                    {/* Results */}
                    <div className="my-5 p-5 border-slate-300 bg-slate-200 rounded">
                        <h3 className="font-bold">Results</h3>
                        {results.map((result, resultIndex) => (
                            <div
                                key={result.id}
                                className="flex flex-col my-3 p-3 rounded"
                            >
                                <div className="flex flex-row">
                                    <label className="text-nowrap px-2 self-center">
                                        Min Points:
                                    </label>
                                    <Input
                                        type="number"
                                        defaultValue={result.minPoints.toString()}
                                        className="border rounded p-2 mx-5 w-full"
                                        onChange={(e) =>
                                            handleResultMinPointsChange(
                                                resultIndex,
                                                e
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex flex-row">
                                    <label className="text-nowrap px-2 self-center">
                                        Max Points:
                                    </label>
                                    <Input
                                        type="number"
                                        defaultValue={result.maxPoints.toString()}
                                        className="border rounded p-2 mx-5 w-full"
                                        onChange={(e) =>
                                            handleResultMaxPointsChange(
                                                resultIndex,
                                                e
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex flex-row">
                                    <label className="text-nowrap px-2 self-center">
                                        Result Text:
                                    </label>
                                    <Textarea
                                        type="textarea"
                                        value={result.resultText}
                                        className="border rounded p-2 mx-5 w-full"
                                        classNames={{
                                            base: 'max-w-full',
                                            input: 'resize-y min-h-[40px]',
                                        }}
                                        onChange={(e) =>
                                            handleResultTextChange(
                                                resultIndex,
                                                e
                                            )
                                        }
                                    />
                                </div>
                                {/* Delete result button */}
                                <Button
                                    onClick={() =>
                                        handleDeleteResult(result.id)
                                    }
                                    color="danger"
                                    variant="ghost"
                                >
                                    Delete Result
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Button
                            color="primary"
                            variant="ghost"
                            onClick={handleAddQuestion}
                            isLoading={isAddQLoading}
                        >
                            Add Question
                        </Button>
                        <Button
                            color="primary"
                            variant="ghost"
                            onClick={handleAddResult}
                            isLoading={isAddResultLoading}
                        >
                            Add Result
                        </Button>
                        <Button
                            color="primary"
                            variant="ghost"
                            onClick={handleSubmit}
                            isLoading={isSubmitLoading}
                        >
                            Save Changes
                        </Button>
                    </div>

                    <Button
                        color="danger"
                        variant="ghost"
                        className="mt-5"
                        onClick={handleQuizDelete}
                    >
                        Delete Quiz
                    </Button>
                    <DisplayMessage formStateMessage={formStateMessage} />
                </div>
            </div>
        </>
    )
}
