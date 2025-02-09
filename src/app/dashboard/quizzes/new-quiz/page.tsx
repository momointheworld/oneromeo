'use client'
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import * as action from '@/actions'
import DisplayMessage from '@/components/common/message'
import { Button, Select, SelectItem, Input, Textarea } from '@nextui-org/react'
import paths from '@/components/paths'
import PageBreadcrumbs from '@/components/common/breadcrumbs'

interface AnswerDataProps {
    text: string
    points: number // Points associated with each answer
}

interface QuestionDataProps {
    text: string
    answers: AnswerDataProps[]
}

interface ResultDataProps {
    minPoints: number
    maxPoints: number
    resultText: string
}

interface QuizDataProps {
    date: Date
    quizName: string
    quizDescription: string
    quizIcon: string
    questions: QuestionDataProps[]
    results: ResultDataProps[] // Include results in the quiz data
}

interface Breadcrumb {
    href: string
    text: string
}

export default function NewQuiz() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [quizName, setQuizName] = useState('')
    const [quizIcon, setQuizIcon] = useState('')
    const [quizDescription, setQuizDescription] = useState('')
    const [formStateMessage, setFormStateMessage] = useState('')
    const [questions, setQuestions] = useState<QuestionDataProps[]>([
        {
            text: '',
            answers: [
                { text: '', points: 0 },
                { text: '', points: 0 },
                { text: '', points: 0 },
                { text: '', points: 0 },
            ],
        },
    ])
    const [results, setResults] = useState<ResultDataProps[]>([
        { minPoints: 0, maxPoints: 20, resultText: '' },
    ])

    const breadcrumbs: Breadcrumb[] = [
        { href: paths.dashboard(), text: 'Dashboard' },
        { href: paths.showAllQuizzes(), text: 'Quizzes' },
        { href: paths.createNewQuiz(), text: `New Quiz` },
    ]

    const handleAddQuestion = () => {
        setQuestions((prevQuestions) => [
            ...prevQuestions,
            {
                text: '',
                answers: [
                    { text: '', points: 0 },
                    { text: '', points: 0 },
                    { text: '', points: 0 },
                    { text: '', points: 0 },
                ],
            },
        ])
    }

    const handleCancelQuestion = () => {
        setQuestions((prevQuestions) => {
            if (prevQuestions.length > 1) {
                const updatedQuestions = [...prevQuestions]
                updatedQuestions.pop()
                return updatedQuestions
            } else {
                return prevQuestions
            }
        })
    }

    const handleAddResult = () => {
        setResults((prevResults) => [
            ...prevResults,
            { minPoints: 0, maxPoints: 20, resultText: '' },
        ])
    }

    const handleRemoveResult = () => {
        setResults((prevResults) => {
            if (prevResults.length > 1) {
                const updatedResults = [...prevResults]
                updatedResults.pop()
                return updatedResults
            } else {
                return prevResults
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormStateMessage(
            'Quiz is being added, you will be redirected, please hold on...'
        )
        try {
            const formDataForQuiz: QuizDataProps = {
                date: selectedDate || new Date(),
                quizName,
                quizIcon,
                quizDescription,
                questions,
                results,
            }
            console.log(formDataForQuiz)
            await action.createQuiz(formDataForQuiz)
            setFormStateMessage('Quiz created successfully, redirecting...')
        } catch (error) {
            if (error instanceof Error) {
                setFormStateMessage(error.message)
            } else {
                setFormStateMessage('Something went wrong, try again later.')
            }
        }
    }

    const handleQuestionChange = (index: number, value: string) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions]
            updatedQuestions[index].text = value
            return updatedQuestions
        })
    }

    const handleAnswerChange = (
        questionIndex: number,
        answerIndex: number,
        value: string
    ) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions]
            updatedQuestions[questionIndex].answers[answerIndex].text = value
            return updatedQuestions
        })
    }

    const handlePointsChange = (
        questionIndex: number,
        answerIndex: number,
        value: string
    ) => {
        setQuestions((prevQuestions) => {
            const updatedQuestions = [...prevQuestions]
            updatedQuestions[questionIndex].answers[answerIndex].points =
                parseInt(value, 10)
            return updatedQuestions
        })
    }

    const handleResultChange = (
        index: number,
        field: 'minPoints' | 'maxPoints' | 'resultText',
        value: string
    ) => {
        setResults((prevResults) => {
            const updatedResults = [...prevResults]
            const updatedResult = { ...updatedResults[index] }
            if (field === 'resultText') {
                updatedResult.resultText = value
            } else {
                updatedResult[field] = parseInt(value, 10)
            }
            updatedResults[index] = updatedResult
            return updatedResults
        })
    }

    return (
        <>
            <PageBreadcrumbs items={breadcrumbs} />

            <div className="flex justify-center text-center">
                <div className="flex flex-col lg:w-3/5 md:w-full">
                    <h1>New Quiz</h1>
                    <div className="flex flex-col gap-4 font-bold">
                        {/* Datepicker */}
                        <div>
                            <label
                                htmlFor="date"
                                className="text-nowrap self-center"
                            >
                                Date:{' '}
                            </label>
                            <DatePicker
                                id="date"
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                        <div className="flex flex-row">
                            <label
                                className="text-nowrap self-center"
                                htmlFor="quizName"
                            >
                                Quiz Name:
                            </label>
                            <input
                                type="text"
                                id="quizName"
                                name="quizName"
                                value={quizName}
                                className="border rounded p-2 mx-5 w-full"
                                onChange={(e) => setQuizName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-row">
                            <label
                                className="text-nowrap self-center"
                                htmlFor="quizDescription"
                            >
                                Quiz Description:
                            </label>
                            <input
                                type="text"
                                id="quizDescription"
                                name="quizDescription"
                                value={quizDescription}
                                className="border rounded p-2 mx-5 w-full"
                                onChange={(e) =>
                                    setQuizDescription(e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="flex flex-row">
                            <label
                                className="text-nowrap self-center"
                                htmlFor="quizIcon"
                            >
                                Quiz Icon:
                            </label>
                            <input
                                type="text"
                                id="quizIcon"
                                name="quizIcon"
                                value={quizIcon}
                                className="border rounded p-2 mx-5 w-full"
                                onChange={(e) => setQuizIcon(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Questions + Answers + buttons */}
                    <div className="flex flex-col">
                        {/* Questions */}
                        {questions.map((question, questionIndex) => (
                            <div
                                key={questionIndex}
                                className="flex flex-col justify-between my-5 p-3 bg-slate-200 rounded border"
                            >
                                <div className="flex font-bold">
                                    <label
                                        className="text-nowrap px-2 self-center"
                                        htmlFor={`question${questionIndex}`}
                                    >
                                        Question {questionIndex + 1}:
                                    </label>
                                    <input
                                        type="text"
                                        id={`question${questionIndex}`}
                                        name={`question${questionIndex}`}
                                        value={question.text}
                                        className="border rounded p-2 mx-5 w-full"
                                        onChange={(e) =>
                                            handleQuestionChange(
                                                questionIndex,
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                                {/* Answers */}
                                {question.answers.map((answer, answerIndex) => (
                                    <div
                                        key={answerIndex}
                                        className="flex flex-row my-2 p-3 rounded"
                                    >
                                        <label
                                            className="text-nowrap px-2 self-center"
                                            htmlFor={`answer${questionIndex}${answerIndex}`}
                                        >
                                            {String.fromCharCode(
                                                65 + answerIndex
                                            )}
                                            :
                                        </label>
                                        <Textarea
                                            type="text"
                                            id={`answer${questionIndex}${answerIndex}`}
                                            name={`answer${questionIndex}${answerIndex}`}
                                            value={answer.text}
                                            className="border rounded px-2"
                                            classNames={{
                                                base: 'max-w-full',
                                                input: 'resize-y min-h-[40px]',
                                            }}
                                            onChange={(e) =>
                                                handleAnswerChange(
                                                    questionIndex,
                                                    answerIndex,
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <Select
                                            id={`points${questionIndex}${answerIndex}`}
                                            name={`points${questionIndex}${answerIndex}`}
                                            label="Point"
                                            className="w-1/3"
                                            value={answer.points}
                                            onChange={(e) =>
                                                handlePointsChange(
                                                    questionIndex,
                                                    answerIndex,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            {[0, 5, 10, 15].map((point) => (
                                                <SelectItem
                                                    key={point}
                                                    value={point}
                                                    textValue={point.toString()}
                                                >
                                                    {point}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        ))}
                        {/* Add/Remove Question Buttons */}
                        <div className="flex justify-between my-3">
                            <Button onClick={handleAddQuestion} color="primary">
                                Add Question
                            </Button>
                            <Button
                                onClick={handleCancelQuestion}
                                color="warning"
                            >
                                Remove Question
                            </Button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="flex flex-col">
                        {results.map((result, resultIndex) => (
                            <div
                                key={resultIndex}
                                className="flex flex-col justify-between my-5 p-3 bg-slate-200 rounded border"
                            >
                                <div className="flex flex-row my-2">
                                    <label
                                        htmlFor={`minPoints${resultIndex}`}
                                        className="text-nowrap self-center px-2"
                                    >
                                        Min Points:
                                    </label>
                                    <Input
                                        type="number"
                                        id={`minPoints${resultIndex}`}
                                        value={result.minPoints.toString()} // Convert number to string
                                        onChange={(e) =>
                                            handleResultChange(
                                                resultIndex,
                                                'minPoints',
                                                e.target.value
                                            )
                                        }
                                        className="border rounded p-2"
                                        required
                                    />
                                </div>
                                <div className="flex flex-row my-2">
                                    <label
                                        htmlFor={`maxPoints${resultIndex}`}
                                        className="text-nowrap self-center px-2"
                                    >
                                        Max Points:
                                    </label>
                                    <Input
                                        type="number"
                                        id={`maxPoints${resultIndex}`}
                                        value={result.maxPoints.toString()} // Convert number to string
                                        onChange={(e) =>
                                            handleResultChange(
                                                resultIndex,
                                                'maxPoints',
                                                e.target.value
                                            )
                                        }
                                        className="border rounded p-2"
                                        required
                                    />
                                </div>
                                <div className="flex flex-row my-2">
                                    <label
                                        htmlFor={`resultText${resultIndex}`}
                                        className="text-nowrap self-center px-2"
                                    >
                                        Result Text:
                                    </label>
                                    <Textarea
                                        type="text"
                                        id={`resultText${resultIndex}`}
                                        value={result.resultText}
                                        onChange={(e) =>
                                            handleResultChange(
                                                resultIndex,
                                                'resultText',
                                                e.target.value
                                            )
                                        }
                                        className="border rounded p-2 "
                                        classNames={{
                                            base: 'max-w-full',
                                            input: 'resize-y min-h-[40px]',
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-between my-3">
                            <Button onClick={handleAddResult} color="primary">
                                Add Result
                            </Button>
                            <Button
                                onClick={handleRemoveResult}
                                color="warning"
                            >
                                Remove Result
                            </Button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <form onSubmit={handleSubmit}>
                        <Button
                            type="submit"
                            // onClick={handleSubmit}
                            color="primary"
                        >
                            Save Quiz
                        </Button>
                    </form>
                    <div className="my-5">
                        <DisplayMessage
                            formStateMessage={formStateMessage}
                            color="warning"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
