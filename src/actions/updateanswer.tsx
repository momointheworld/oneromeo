'use server';
import { db } from "@/db";

interface UpdateAnswerProps {
    text: string;
    points: number; 
  }
  
  
  export async function updateAnswer(id: string, data: UpdateAnswerProps) {
    const { text, points } = data;
    try {
      const updatedAnswer = await db.answer.update({
        where: { id },
        data: {
          text,
          points,
        },
      });
      console.log(updatedAnswer);
      return updatedAnswer;
    } catch (error: any) {
      if (error.code === 'P2025') { // code P2025 indicates that the record to update was not found.
        // Handle the case where the answer record does not exist
        console.log(`Answer with ID ${id} not found.`);
        return null; // Return null to proceed to update the Quiz
      } else {
        // For other errors, rethrow the error
        throw new Error(`Error updating answer: ${error}`);
      }
    }
  }