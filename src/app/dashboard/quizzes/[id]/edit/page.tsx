'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import * as action from "@/actions";


interface AnswerDataProps {
    id: string;
    text: string;
    points: number; 
  }
  
  interface QuestionDataProps {
    id: string;
    quizId: string;
    text: string;
    answers: AnswerDataProps[];
  }
  
  interface QuizDataProps {
    id: string;
    quizName: string;
    questions: QuestionDataProps[];
  }

export default function ModifyQuizzes() {
    const [quiz, setQuiz] = useState<QuizDataProps | null>(null); 
    const [questions, setQuestions] = useState<QuestionDataProps[]>([]);  
    const [answers, setAnswers] = useState<AnswerDataProps[][]>([]);  
    const params = useParams();
    const id = params.id?.toString();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) return;
                // Get quiz data
                const fetchedQuiz = await action.getQuiz({ id });
                setQuiz(fetchedQuiz);
                
                // Get questions data
                const fetchedQuestions = await action.getQuestions(id);
                setQuestions(fetchedQuestions);
                
                // Loop through questions to get answers for each question
                const allAnswers: AnswerDataProps[][] = [];
                for (const question of fetchedQuestions) {
                    const fetchedAnswers = await action.getAnswers(question.id);
                    allAnswers.push(fetchedAnswers);
                }
                setAnswers(allAnswers);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
         }, [id]);

    console.log(quiz);
    console.log(questions);
    console.log(answers);

    // Update quiz name
    const handleQuizNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (quiz) {
            setQuiz({ ...quiz, quizName: event.target.value });
        }
    };

    // Update question text
    const handleQuestionTextChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].text = event.target.value;
        setQuestions(updatedQuestions);
    };

    // Update answer text
    const handleAnswerTextChange = (questionIndex: number, answerIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedAnswers = [...answers];
        updatedAnswers[questionIndex][answerIndex].text = event.target.value;
        setAnswers(updatedAnswers);
    };

    // Handle selecting points for an answer
    const handleAnswerPointsChange = (questionIndex: number, answerIndex: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedAnswers = [...answers];
        updatedAnswers[questionIndex][answerIndex].points = parseInt(event.target.value);
        setAnswers(updatedAnswers);
    };

    // Handle form submission (update data)
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            if (!quiz) {
                throw new Error('Quiz data is not available.');
            }
            // Update answers
            for (let i = 0; i < answers.length; i++) {
                for (const answer of answers[i]) {
                await action.updateAnswer(answer.id, { text: answer.text, points: answer.points });
            }
            }
            // Update questions
            for (const question of questions) {
                await action.updateQuestion(question.id, { text: question.text });
                
            }
            // Update quiz
            await action.updateQuiz(id, { quizName: quiz.quizName });
            
            console.log('Data updated successfully!');
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <div>
            {quiz && (
                <div>
                    <label>Quiz Name:</label>
                    <input type="text" value={quiz.quizName} onChange={handleQuizNameChange} />
                </div>
            )}
            {questions.map((question, questionIndex) => (
                <div key={question.id}>
                    <label>Question {questionIndex + 1}:</label>
                    <input type="text" value={question.text} onChange={(e) => handleQuestionTextChange(questionIndex, e)} />
                    <ul>
                        {answers[questionIndex]?.map((answer, answerIndex) => (
                            <li key={answer.id}>
                                <label>Answer {String.fromCharCode(65 + answerIndex)}:</label>
                                <input type="text" value={answer.text} onChange={(e) => handleAnswerTextChange(questionIndex, answerIndex, e)} />
                                <select value={answer.points} onChange={(e) => handleAnswerPointsChange(questionIndex, answerIndex, e)}>
                                 {[answer.points, ...[0, 5, 10, 15].filter(option => option !== answer.points)].map((option, index) => (
                                 <option key={index} value={option}>{option}</option>
                                 ))}
                                </select>

                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <button type="submit" onClick={handleSubmit}>Save Changes</button>
        </div>
    );
}
