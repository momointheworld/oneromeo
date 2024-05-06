'use server';
import { db } from "@/db";

export async function getQuestions(quizId: string): Promise<any[]> {
    const questions = await db.question.findMany({
      where: { quizId },
    });
    return questions;
  }
  