'use server';
import { db } from "@/db";
import { redirect } from "next/navigation";

interface FormDataProps {
    date: Date,
    title: string,
    slug: string,            
    categoryNames: string[]; 
    body: string,
}

export async function createPost(formData: FormDataProps) {
    const { date, slug, categoryNames, title, body } = formData;

    // Find existing categories by name
    const categories = await db.category.findMany({
        where: { name: { in: categoryNames } },
    });

    // Determine missing category names
    const missingCategoryNames = categoryNames.filter(name => !categories.some(category => category.name === name));

    // Create missing categories
    const createdCategories = await Promise.all(
        missingCategoryNames.map(name => db.category.create({ data: { name } }))
    );

    // Combine existing and newly created categories
    const allCategories = [...categories, ...createdCategories];

    // Extract category IDs
    const categoryIDs = allCategories.map(category => category.id);
    const post = await db.post.create({
        data: {
            date,
            slug,
            categoryIDs,
            title,
            body,
        }
     });
     console.log(post);
     console.log(date);
     redirect('/dashboard');
}

export async function editPost() {
    console.log("calling db");
    
}

// Quiz actions
interface AnswerDataProps {
    text: string;
    isCorrect: boolean;
  }
  
  interface QuestionDataProps {
    text: string;
    answers: AnswerDataProps[];
  }
  
  interface QuizDataProps {
    quizName: string;
    questions: QuestionDataProps[];
  }
  
  export async function createQuiz(formData: QuizDataProps) {
    const { quizName, questions } = formData;
  
    try {
      const quiz = await db.quiz.create({
        data: {
          quizName,
          questions: {
            create: questions.map((question) => ({
              text: question.text,
              answers: {
                create: question.answers.map((answer) => ({
                  text: answer.text,
                  isCorrect: answer.isCorrect,
                })),
              },
            })),
          },
        },
      });
  
      console.log('Quiz created:', quiz, questions, questions[0].answers);
      redirect('/dashboard');
    } catch (error) {
      console.error('Error creating quiz:', error);
      // Handle error, such as displaying an error message to the user
    }
  }
  