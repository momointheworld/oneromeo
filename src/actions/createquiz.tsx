'use server';
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import paths from "@/components/paths";

interface AnswerDataProps {
    text: string;
    points: number; // New field for points associated with each answer
  }
  
  interface QuestionDataProps {
    text: string;
    answers: AnswerDataProps[];
  }
  
  interface QuizDataProps {
    date: Date
    quizName: string;
    questions: QuestionDataProps[];
  }
  
  export async function createQuiz(formData: QuizDataProps) {
    const { date, quizName, questions } = formData;
  
    try {
      const quiz = await db.quiz.create({
        data: {
          date,
          quizName,
          questions: {
            create: questions.map((question) => ({
              text: question.text,
              answers: {
                create: question.answers.map((answer) => ({
                  text: answer.text,
                  points: answer.points, // Include the points field in the answer creation
                })),
              },
            })),
          },
        },
      });
  
      console.log('Quiz created:', quiz);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
       revalidatePath(paths.showAllQuizzes()); 
       redirect(paths.showAllQuizzes());  // redirect needs to be outside of try...catch
  }
  