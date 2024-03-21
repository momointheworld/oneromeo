'use client'
import { useState } from 'react';
import { createQuiz } from '@/actions';

interface AnswerDataProps {
  text: string;
  isCorrect: boolean;
}

interface QuestionDataProps {
  text: string;
  answers: AnswerDataProps[];
  correctAnswer: number | null; // Index of correct answer, null if not set
}

interface QuizDataProps {
  quizName: string;
  questions: QuestionDataProps[];
}

export default function NewQuiz() {
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState<QuestionDataProps[]>([{ text: '', answers: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }], correctAnswer: null }]);

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { text: '', answers: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }], correctAnswer: null },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataForQuiz: QuizDataProps = {
      quizName,
      questions,
    };

    await createQuiz(formDataForQuiz);
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

  const handleCorrectAnswerChange = (questionIndex: number, correctAnswerIndex: number) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[questionIndex].correctAnswer = correctAnswerIndex;
      return updatedQuestions;
    });
  };

  return (
    <div>
      <h1>New Quiz</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="quizName">Quiz Name:</label>
          <input
            type="text"
            id="quizName"
            name="quizName"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            required
          />
        </div>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <label htmlFor={`question${questionIndex}`}>Question {questionIndex + 1}:</label>
            <input
              type="text"
              id={`question${questionIndex}`}
              name={`question${questionIndex}`}
              value={question.text}
              onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
              required
            />
            {question.answers.map((answer, answerIndex) => (
              <div key={answerIndex}>
                <input
                  type="checkbox"
                  id={`answer${questionIndex}${answerIndex}`}
                  name={`answer${questionIndex}${answerIndex}`}
                  checked={question.correctAnswer === answerIndex}
                  onChange={() => handleCorrectAnswerChange(questionIndex, answerIndex)}
                />
                <label htmlFor={`answer${questionIndex}${answerIndex}`}>
                  Answer {String.fromCharCode(65 + answerIndex)}:
                </label>
                <input
                  type="text"
                  id={`answer${questionIndex}${answerIndex}`}
                  name={`answer${questionIndex}${answerIndex}`}
                  value={answer.text}
                  onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion}>Add Question</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
