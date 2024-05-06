'use server';
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteQuestion(id: string) {
    let questionQuizId: string; 
    try {
      // Fetch the question and its associated answers
      const question = await db.question.findUnique({
        where: { id },
        include: {
          answers: true,
        },
      });
      if (!question) {
        redirect('/dashboard/quizzes/')
      }
      questionQuizId = question.quizId; // Store the questionQuizId
      // Delete the associated answers first
      await Promise.all(question.answers.map(async (answer) => {
        await db.answer.delete({ where: { id: answer.id } });
        console.log(`Answer ${answer.id} deleted for question ${id}.`);
      }));
      // Now delete the question itself
      await db.question.delete({ where: { id } });
      const questionQuiz = await db.question.findFirst({
        where: {
        quizId: questionQuizId
        }
      })  
      revalidatePath(`/dashboard/quizzes/${questionQuizId}`)
      // if this quiz ID can not be found in the questions, that means the last question was deleted,
      //  proceed to delete the quiz
      if (!questionQuiz) {
        await db.quiz.delete({where: {id: questionQuizId}});
        console.log(`Quiz ${questionQuizId} is deleted`);
        revalidatePath('/dashboard/quizzes');
        redirect('/dashboard/quizzes');
      }
      console.log(`Question ${id} is deleted.`);
    } catch (error) {
      console.error(`Error deleting question: ${error}`);
    } 
  }
  