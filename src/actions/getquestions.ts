'use server';
import { db } from "@/db";
import { notFound } from "next/navigation";

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

export async function getQuestions(quizId: string): Promise<QuestionDataProps[]> {
  try {
    const questions = await db.question.findMany({
      where: { quizId },
      include: { answers: true }, // Ensure answers are included in the result
    });
    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return notFound(); // Return appropriate error response
  }
}
