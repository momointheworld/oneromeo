'use server';
import { db } from "@/db";

interface UpdateAnswerProps {
    text: string;
    points: number; 
  }
  
  export async function updateAnswer(id:string, data:UpdateAnswerProps) {
    const { text, points} = data;
    try {
      const updatedAnswer = await db.answer.update({
        where: { id },
        data: {
          text, 
          points,
        }
      });
      console.log(updatedAnswer);
      return updatedAnswer;
    } catch (error) {
      throw new Error(`Error updating question: ${error}`);
    }
  }
  