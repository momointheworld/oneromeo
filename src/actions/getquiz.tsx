'use server';
import { db } from "@/db";
import { notFound } from "next/navigation";


interface GetQuizProps {
    id: string;
  }
  
  // export async function getAllQuizzes(props: GetQuizProps): Promise<any> {
  //  const allQuizzes = await db.quiz.findMany();
  //  return allQuizzes;
  // }
  
  export async function getQuiz(props: GetQuizProps): Promise<any> {
    const { id } = props;
    const quiz = await db.quiz.findFirst({
        where: { id }, 
    });
    if (!quiz) {
        return notFound();
    }
    return quiz;
  }
  