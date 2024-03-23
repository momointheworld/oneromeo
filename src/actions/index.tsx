'use server';
import { db } from "@/db";
import { notFound, redirect } from "next/navigation";

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
     redirect('/dashboard/posts');
}

interface GetPostProps {
  id: string; // Define 'id' directly in the interface
}

export async function getPost(props: GetPostProps): Promise<any> {
  const { id } = props;
  const post = await db.post.findFirst({
      where: { id }, 
  });
  if (!post) {
      return notFound();
  }
  return post;
}
 

interface AnswerDataProps {
  text: string;
  points: number; // New field for points associated with each answer
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
                points: answer.points, // Include the points field in the answer creation
              })),
            },
          })),
        },
      },
    });

    console.log('Quiz created:', quiz);
    redirect('/dashboard/quizzes');
  } catch (error) {
    console.error('Error creating quiz:', error);
    // Handle error, such as displaying an error message to the user
  }
}
