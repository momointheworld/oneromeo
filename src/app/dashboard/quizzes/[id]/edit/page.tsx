'use client';
import {  useEffect, useState } from "react";
import { useParams } from "next/navigation";
import * as actions from "@/actions";
import Link from "next/link";
import DisplayMessage from "@/components/common/message";
import paths from "@/components/paths";
import PageBreadcrumbs from "@/components/common/breadcrumbs";
import FormButton from "@/components/common/formbutton";
import { CardSkeleton, FullSkeleton } from "@/components/common/skeleton-loading";


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
  
  interface fetchedQuiz {
    id: string;
    quizName: string;
    questions: QuestionDataProps[];
  }

  interface Breadcrumb {
    href: string;
    text: string;
  }
  

export default function ModifyQuizzes() {
    const [quiz, setQuiz] = useState<fetchedQuiz | null>(null); 
    const [questions, setQuestions] = useState<QuestionDataProps[]>([]);  
    // const [addQuestion, setAddQuestion] = useState<boolean>(false);
    const [answers, setAnswers] = useState<AnswerDataProps[][]>([]);  
    const params = useParams();
    const id = params.id?.toString();
    const [formStateMessage, setFormStateMessage] = useState('');
    const breadcrumbs: Breadcrumb[] = [
        { href: paths.dashboard(), text: 'Dashboard' },
        { href: paths.showAllQuizzes(), text: 'Quizzes' },
        { href: paths.editQuiz(id), text: 'Edit Quiz' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) return;
                // Get quiz data
                const fetchedQuiz = await actions.getQuiz({ id });
                setQuiz(fetchedQuiz);
                
                // Get questions data
                const fetchedQuestions = await actions.getQuestions(id);
                setQuestions(fetchedQuestions);
                
                // Loop through questions to get answers for each question
                const allAnswers: AnswerDataProps[][] = [];
                for (const question of fetchedQuestions) {
                    const fetchedAnswers = await actions.getAnswers(question.id);
                    allAnswers.push(fetchedAnswers);
                }
                setAnswers(allAnswers);
            } catch (error) {
                console.error('Error fetching data:', error);
                setFormStateMessage(`Error fetching data: ${error}`);
            }
        };
        fetchData();
         }, [id]);

    // console.log(quiz);
    // console.log(questions);
    // console.log(answers);

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

    const handleAddQuestion = async () => {
        setFormStateMessage('Adding question...')
        try {
          // Create a new question on the server
          const newQuestionData = await actions.createQuestion({
            quizId: quiz?.id || '', // Use optional chaining to access quiz.id safely
            text: '',
            answers: [
              { text: '', points: 0 },
              { text: '', points: 0 },
              { text: '', points: 0 },
              { text: '', points: 0 },
            ],
          });
          setFormStateMessage('Question added successfully. Close to continue')
          // Update the local state with the newly created question
          setQuestions((prevQuestions) => [...prevQuestions, newQuestionData]);
          // Reset the answers state to empty arrays
          setAnswers((prevAnswers) => [...prevAnswers, newQuestionData.answers]);
        } catch (error) {
            if (error instanceof Error) {
                setFormStateMessage(error.message);
              } else {
                setFormStateMessage('Something went wrong, try again later.');
              }
        }
      };
      

      const handleDeleteQuestion = async (id: string) => {
        setFormStateMessage('Loading...')
         try {
             await actions.deleteQuestion(id);
              // Update the local state with the newly created question
             setQuestions((prevQuestions) => prevQuestions.filter(question => question.id !== id));
             setFormStateMessage('Question deleted successfully. Close to continue.')
 
         } catch (error) {
            console.error('Error deleting a question:', error);
            setFormStateMessage(`Error deleting a question ${error}`)
         }
      }
      

    // Handle form submission (update data)
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setFormStateMessage('Updating quiz...')
        try {
            if (!quiz) {
                setFormStateMessage('Quiz data is not available.');
                throw new Error('Quiz data is not available.');
            }
            // Update answers
            // for (let i = 0; i < answers.length; i++) {
            //     for (const answer of answers[i]) {
            //     await actions.updateAnswer(answer.id, { text: answer.text, points: answer.points });
            //     setFormStateMessage('Answers updated successfully, please hold.');
            // }
            // }
            for (const answerList of answers) {
                for (const answer of answerList) {
                    if (answer.id) {
                        await actions.updateAnswer(answer.id, { text: answer.text, points: answer.points });
                        setFormStateMessage('Answers updated successfully, please hold.');
                    } else {
                        console.log('Answer not found, skipping update.');
                    }
                }
            }

            // Update questions
            for (const question of questions) {
                // Check if the question exists before updating it
                const existingQuestion = questions.find(q => q.id === question.id);
                if (existingQuestion) {
                    await actions.updateQuestion(question.id, { text: question.text });
                    setFormStateMessage('Questions updated successfully, please hold.');
                } 
            }
           
            // Update quiz
            await actions.updateQuiz(id, { quizName: quiz.quizName });
            console.log('Data updated successfully!');
            setFormStateMessage('Quiz data updated successfully...reloading');
        } catch (error) {
            console.error('Error updating data:', error);
            setFormStateMessage('Failed to update quiz data, please refresh the page!');
        }
    };

    if (!quiz || !questions || !answers) {
        return (
        <div className="gap-3">
            <FullSkeleton />
            <CardSkeleton />
        </div>
        )
      }
      
    return (
    <>
       <PageBreadcrumbs items={breadcrumbs} />
        <DisplayMessage formStateMessage={formStateMessage} actions={function (): Promise<FormData> {
                throw new Error("Function not implemented.");
            } } />
        <div className='flex justify-center'>
        <div className='flex flex-col justify-center lg:w-2/3 md:w-full content-evenly'>
            {/* quiz title */}
            {quiz && (
                <div className="flex flex-row">
                    <label className='text-nowrap self-center'>Quiz Name:</label>
                    <input 
                    type="text" 
                    value={quiz.quizName} 
                    className="border rounded p-2 mx-5 w-full"
                    onChange={handleQuizNameChange} />
                </div>
            )}
            {/* questions */}
            {questions.map((question, questionIndex) => (
                <div key={question.id} className="flex flex-col justify-between my-5 p-5 border-slate-300 bg-slate-200 rounded">
                    <div className="flex font-bold">
                        <label className='text-nowrap px-2 self-center'>Question {questionIndex + 1}:</label>
                        <input type="text" 
                            value={question.text} 
                            className="border rounded p-2 mx-5 w-full"
                            onChange={(e) => handleQuestionTextChange(questionIndex, e)}
                        />
                     </div>
                     {/* answers */}
                        {answers[questionIndex]?.map((answer, answerIndex) => (
                            <div key={answer.id} className='flex flex-row my-2 p-3 rounded '>
                                <label className='text-nowrap px-2 content-evenly'>{String.fromCharCode(65 + answerIndex)}:</label>
                                <input type="text" 
                                value={answer.text} 
                                className="border rounded p-2 w-full"
                                onChange={(e) => handleAnswerTextChange(questionIndex, answerIndex, e)} />
                                <select 
                                value={answer.points} 
                                className="border rounded p-2"
                                onChange={(e) => handleAnswerPointsChange(questionIndex, answerIndex, e)}>
                                 {[answer.points, ...[0, 5, 10, 15].filter(option => option !== answer.points)].map((option, index) => (
                                 <option 
                                 key={index} 
                                 value={option}>{option}
                                 </option>
                                 ))}
                                </select>
                            </div>
                        ))}
                        {/* delete question button */}
                        <FormButton  onClick={() => handleDeleteQuestion(question.id)} color="danger">
                          Delete Question
                        </FormButton>
                </div>
            ))}
            <div className="flex gap-4 justify-center">
                <FormButton onClick={handleAddQuestion} > 
                    Add Question
                </FormButton>
                <FormButton onClick={handleSubmit}>
                    Save Changes
                </FormButton>
            </div>
        </div>
    </div>
    </>
    );
}
