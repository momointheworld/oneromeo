'use server';
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface UpdateQuizProps {
    quizName: string
  }
  
  export async function updateQuiz(id: string, data: UpdateQuizProps) {
    const { quizName} = data
    try {
      const updatedQuiz = await db.quiz.update({
        where: { id },
        data: {
          quizName,
        }
      });
      console.log(`Quiz updated successfully, redirecting...`, updatedQuiz);
    } catch (error) {
      console.log(`Error updating quiz: ${error}`);
    }
     revalidatePath(`/dashboard/quizzes/${id}`);
     redirect(`/dashboard/quizzes/${id}`);
  }
   