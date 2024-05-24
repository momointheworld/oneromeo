'use server';
import { db } from "@/db";
import { Quiz } from "@prisma/client";
import { notFound } from "next/navigation";
import { cache } from "react";


interface GetQuizProps {
    id: string;
  }
  
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

    // Define the interface for fetchedQuiz
    interface FetchedQuiz {
      id: string;
      quizName: string;
      questions: QuestionDataProps[];
    }
  // export async function getAllQuizzes(props: GetQuizProps): Promise<any> {
  //  const allQuizzes = await db.quiz.findMany();
  //  return allQuizzes;
  // }
  // Define the type for fetchedQuiz in the server action
export const getQuiz = cache(async (props: GetQuizProps): Promise<FetchedQuiz | typeof notFound> => {
  console.log("getting single quiz");

  const { id } = props;
  const quiz = await db.quiz.findFirst({
      where: { id },
      include: {
          questions: {
              include: {
                  answers: true,
              },
          },
      },
  });
  if (!quiz) {
      return notFound(); // Return notFound if quiz is not found
  }
  return quiz;
});
