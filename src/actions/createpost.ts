'use server';
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import paths from "@/components/paths";

interface FormDataProps {
    date: Date,
    title: string,
    slug: string,            
    categoryNames: string[]; 
    body: string,
}

type FormState = {
  message: string;
}

export async function createPost(formState: FormState, formData: FormDataProps):  Promise<FormState>{
    const { date, slug, categoryNames, title, body } = formData;
    let postId: string | null = null;
try {
    // Check if title and body are empty
    if (!title || !body) {
      return {
          message: 'Please fill out the Title and Body',
      };
  }

    // Find existing categories by name
    const categories = await db.category.findMany({
        where: { name: { in: categoryNames } },
    });
    // Determine missing category names
    const missingCategoryNames = categoryNames.filter(name => !categories.some(category => category.name === name));

    // Create missing categories
    const createdCategories = await Promise.all(
        missingCategoryNames.map(name => db.category.create({ data: { name, date: new Date()} }))
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
     console.log('Post created successfully.', post.title);
     
     postId = post.id;

    } catch (error) {
      // Catch any errors that occur during post creation
      return {
          message: error instanceof Error ? error.message : 'Something went wrong, try again later.'
      };
  }
    revalidatePath(paths.showSinglePost(postId));
    redirect(paths.showSinglePost(postId));
      
 }
