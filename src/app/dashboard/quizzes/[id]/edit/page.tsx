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
    quizDescription: string
    quizIcon: string
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

    const handleQuizDescriptionChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (quiz) {
            setQuiz({ ...quiz, quizDescription: event.target.value })
        }
    }

    const handleQuizIconChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (quiz) {
            setQuiz({ ...quiz, quizIcon: event.target.value })
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
            await actions.updateQuiz(id, {
                quizName: quiz.quizName,
                quizIcon: quiz.quizIcon,
                quizDescription: quiz.quizDescription,
            })
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
            await actions.deleteQuiz(id)
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

            <div className="flex justify-center py-6 px-4">
                <div className="flex flex-col w-full lg:w-2/3 md:w-full">
                    {/* Quiz Title */}
                    {quiz && (
                        <div className="space-y-3 mb-5">
                            <div className="grid grid-cols-3 gap-2">
                                <label className="text-lg font-medium bg-gray-200 border-2">
                                    Quiz Name
                                </label>
                                <input
                                    type="text"
                                    value={quiz.quizName}
                                    className="col-span-2 focus:outline-none focus:ring-1 focus:ring-indigo-500  border-b border-b-gray-500"
                                    onChange={handleQuizNameChange}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <label className="text-lg font-medium bg-gray-200 border-2 ">
                                    Quiz Description
                                </label>
                                <input
                                    type="text"
                                    value={quiz.quizDescription}
                                    className="col-span-3 focus:outline-none focus:ring-1 focus:ring-indigo-500  border-b border-b-gray-500"
                                    onChange={handleQuizDescriptionChange}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <label className="text-lg font-medium bg-gray-200 border-2 ">
                                    Quiz Icon
                                </label>
                                <input
                                    type="text"
                                    value={quiz.quizIcon}
                                    className="col-span-3 focus:outline-none focus:ring-1 focus:ring-indigo-500  border-b border-b-gray-500"
                                    onChange={handleQuizIconChange}
                                />
                            </div>
                        </div>
                    )}

                    {/* Questions Section */}
                    {questions.map((question, questionIndex) => (
                        <div key={question.id} className="space-y-3 p-5 mt-5">
                            <div className="grid grid-cols-3 gap-2">
                                <label className="text-lg font-medium bg-orange-200 ">
                                    Question {questionIndex + 1}
                                </label>
                                <input
                                    type="text"
                                    value={question.text}
                                    className="col-span-2 focus:outline-none focus:ring-1 focus:ring-indigo-500  border-b border-b-gray-500"
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
                                        className="grid grid-cols-6"
                                    >
                                        <div className="text-xs text-orange-700 text-start">
                                            {String.fromCharCode(
                                                65 + answerIndex
                                            )}
                                            :
                                        </div>
                                        <div className="col-start-1 col-span-5">
                                            <Input
                                                value={answer.text}
                                                className="focus:outline-none focus:ring-1 focus:ring-indigo-500 "
                                                onChange={(e) =>
                                                    handleAnswerTextChange(
                                                        questionIndex,
                                                        answerIndex,
                                                        e
                                                    )
                                                }
                                            />
                                        </div>
                                        <select
                                            value={answer.points}
                                            className="focus:outline-none focus:ring-1 focus:ring-indigo-500 border-b border-b-gray-500"
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
                                            ].map((option) => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )
                            )}

                            {/* Delete Question Button */}
                            <Button
                                onClick={() =>
                                    handleDeleteQuestion(question.id)
                                }
                                color="danger"
                                variant="flat"
                                className="text-xs font-medium float-right"
                            >
                                Delete Question
                            </Button>
                        </div>
                    ))}

                    {/* Results Section */}
                    <div className="flex flex-col space-y-3 ">
                        <p className="text-lg font-medium text-gray-700">
                            Results
                        </p>
                        {results.map((result, resultIndex) => (
                            <div key={result.id} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-medium text-gray-600">
                                        Min Points
                                    </label>
                                    <Input
                                        type="number"
                                        defaultValue={result.minPoints.toString()}
                                        className="p-2 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        onChange={(e) =>
                                            handleResultMinPointsChange(
                                                resultIndex,
                                                e
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-medium text-gray-600">
                                        Max Points
                                    </label>
                                    <Input
                                        type="number"
                                        defaultValue={result.maxPoints.toString()}
                                        className="p-2 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        onChange={(e) =>
                                            handleResultMaxPointsChange(
                                                resultIndex,
                                                e
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-medium text-gray-600">
                                        Result Text
                                    </label>
                                    <Textarea
                                        value={result.resultText}
                                        className="p-2 w-full resize-y min-h-[40px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        onChange={(e) =>
                                            handleResultTextChange(
                                                resultIndex,
                                                e
                                            )
                                        }
                                    />
                                </div>

                                {/* Delete Result Button */}
                                <Button
                                    onClick={() =>
                                        handleDeleteResult(result.id)
                                    }
                                    color="danger"
                                    variant="flat"
                                    className="text-xs font-medium float-right"
                                >
                                    Delete Result
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col mt-20 gap-2">
                        <Button
                            color="primary"
                            variant="ghost"
                            onClick={handleAddQuestion}
                            isLoading={isAddQLoading}
                            className="w-1/3 text-sm font-medium"
                        >
                            Add Question
                        </Button>
                        <Button
                            color="primary"
                            variant="ghost"
                            onClick={handleAddResult}
                            isLoading={isAddResultLoading}
                            className="w-1/3 text-sm font-medium"
                        >
                            Add Result
                        </Button>
                        <Button
                            color="warning"
                            variant="solid"
                            onClick={handleSubmit}
                            isLoading={isSubmitLoading}
                            className="w-1/3 mt-5 text-sm font-medium"
                        >
                            Save Changes
                        </Button>
                    </div>

                    {/* Delete Quiz */}
                    <Button
                        color="danger"
                        variant="solid"
                        onClick={handleQuizDelete}
                        className="mt-8 w-full"
                    >
                        Delete Quiz
                    </Button>

                    {/* Form State Message */}
                    <DisplayMessage formStateMessage={formStateMessage} />
                </div>
            </div>
        </>
    )
}
