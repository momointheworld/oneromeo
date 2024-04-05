'use client'
import React, { useState } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import * as action from '@/actions';

interface AnswerDataProps {
  text: string;
  points: number; // Points associated with each answer
}

interface QuestionDataProps {
  text: string;
  answers: AnswerDataProps[];
}

interface QuizDataProps {
  quizName: string;
  questions: QuestionDataProps[];
}

export default function NewQuiz() {
  const [quizName, setQuizName] = useState('');
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
  ]);

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
    ]);
  };
  const handleCancelQuestion = () => {
    setQuestions((prevQuestions) => {
      // Check if there are more than one question
      if (prevQuestions.length > 1) {
        // Remove the last question from the array
        const updatedQuestions = [...prevQuestions];
        updatedQuestions.pop(); // Remove the last element
        return updatedQuestions;
      } else {
        return prevQuestions; // Cannot remove the last question, return the original array
      }
    });
  };
  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataForQuiz: QuizDataProps = {
      quizName,
      questions,
    };

    await action.createQuiz(formDataForQuiz);
  };


  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].text = value;
      return updatedQuestions;
    });
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number, value: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].answers[answerIndex].text = value;
      return updatedQuestions;
    });
  };

  const handlePointsChange = (questionIndex: number, answerIndex: number, value: string) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].answers[answerIndex].points = parseInt(value, 10);
      return updatedQuestions;
    });
  };

  return (
    <>
    <div className="my-5">
             <Link href={'/dashboard/'}>Dashboard</Link> {"\u00AB"} <Link href={'/dashboard/quizzes'}>quizzes</Link> {"\u00AB"} New Quiz
    </div>
    <div className='flex justify-center'>
    <div className='flex flex-col lg:w-1/2 md:w-full'>
      <h1>New Quiz</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row font-bold">
          {/* quiz title */}
          <label className='text-nowrap self-center' htmlFor="quizName">Quiz Name:</label>
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
        {/* questions */}
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="flex flex-col justify-between my-5 p-3 bg-slate-200 rounded border">
             <div className="flex font-bold">
            <label className='text-nowrap px-2 self-center' htmlFor={`question${questionIndex}`}>Question {questionIndex + 1}:</label>
            <input
              type="text"
              id={`question${questionIndex}`}
              name={`question${questionIndex}`}
              value={question.text}
              className="border rounded p-2 mx-5 w-full"
              onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
              required
            />
            </div>
            {/* answers */}
            {question.answers.map((answer, answerIndex) => (
              <div key={answerIndex} className='flex flex-row my-2 p-3 rounded'>  
                <label className='text-nowrap px-2 self-center' htmlFor={`answer${questionIndex}${answerIndex}`}>
                  {String.fromCharCode(65 + answerIndex)}:
                </label>
                <input
                  type="text"
                  id={`answer${questionIndex}${answerIndex}`}
                  name={`answer${questionIndex}${answerIndex}`}
                  value={answer.text}
                  className="border rounded p-2 w-full"
                  onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
                  required
                />
                <select
                  id={`points${questionIndex}${answerIndex}`}
                  name={`points${questionIndex}${answerIndex}`}
                  className="border rounded p-2"
                  value={answer.points}
                  onChange={(e) => handlePointsChange(questionIndex, answerIndex, e.target.value)}
                  required
                >
                  <option value="0">0</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>
            ))}
          </div>
        ))}
          <div className="flex gap-4 justify-end">
        <button type="button" 
        onClick={handleAddQuestion} 
        className="rounded bg-blue-500 shadow-md text-zinc-200 hover:text-zinc-900 shadow-stone-600 px-4 py-2 mx-2">
          Add Question
        </button>
        <button type="button" 
        onClick={handleCancelQuestion} 
        className="rounded bg-blue-500 shadow-md text-zinc-200 hover:text-zinc-900 shadow-stone-600 px-4 py-2 mx-2">
          Cancel adding Question
        </button>
        <button 
        type="submit"
        className="rounded bg-blue-500 shadow-md text-zinc-200 hover:text-zinc-900 shadow-stone-600 px-4 py-2">
          Submit</button>
          </div>
      </form>
    </div>
    </div>
    </>
  );
}
