'use server';
import { db } from "@/db";

interface UpdateQuestionProps {
    text: string;
  }
  
  export async function updateQuestion(id:string, data: UpdateQuestionProps) {
    const { text } = data;
    try {
      const updatedQuestion = await db.question.update({
        where: {  id },
        data: {
          text,
        }
      });
      console.log(updatedQuestion);
      return updatedQuestion;
    } catch (error) {
      throw new Error(`Error updating question: ${error}`);
    }
  }
  
  