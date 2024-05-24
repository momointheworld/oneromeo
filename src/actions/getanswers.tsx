'use server';
import { db } from "@/db";
import { Answer } from "@prisma/client";

export async function getAnswers(questionId: string): Promise<Answer[]> {
  console.log("Fetching Answers");
    const answers = await db.answer.findMany({
      where: { questionId },
    });
    return answers;
  }