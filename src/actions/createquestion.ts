'use server';
import { db } from "@/db";

interface AnswerDataProps {
  text: string;
  points: number; // New field for points associated with each answer
}

interface CreateQuestionProps {
    quizId: string;
    text: string;
    answers: AnswerDataProps[];
  }
  
  export async function createQuestion(formData: CreateQuestionProps) {
    const { quizId, text, answers } = formData;
  
    try {
      // Create the question and associated answers
      const newQuestion = await db.question.create({
        data: {
          text,
          answers: {
            createMany: {
              data: answers.map((answer) => ({
                text: answer.text,
                points: answer.points,
              })),
            },
          },
          quiz: {
            connect: { id: quizId }, // Connect the question to the quiz based on quizId
          },
        },
        include: {
          answers: true, // Include answers in the response
        },
      });
      return newQuestion; // Return the newly created question with answers
    } catch (error) {
      console.error('Error creating question:', error);
      throw error; // Throw the error to handle it in the caller function
    }
  }