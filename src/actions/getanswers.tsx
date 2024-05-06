'use server';
import { db } from "@/db";

export async function getAnswers(questionId: string): Promise<any[]> {
    const answers = await db.answer.findMany({
      where: { questionId },
    });
    return answers;
  }