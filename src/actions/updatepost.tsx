'use server';
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import paths from "@/components/paths";

interface FormState {
    message: string;
  }

interface UpdateFormDataProps {
    date: Date,
    title: string,
    slug: string,            
    categoryNames: string[]; 
    body: string,
    id: string,
  }

  export async function updatePost(formState: FormState, data: UpdateFormDataProps): Promise<FormState> {
    const { date, slug, categoryNames, title, body, id } = data;
  
    try {
        let categoryIDs: string[] = [];
  
        if (categoryNames && categoryNames.length > 0) {
            // Find existing categories by name
            const categories = await db.category.findMany({
                where: { name: { in: categoryNames } },
            });
  
            // Determine missing category names
            const missingCategoryNames = categoryNames.filter(name => !categories.some(category => category.name === name));
  
            // Create missing categories
            const createdCategories = await Promise.all(
                missingCategoryNames.map(name => db.category.create({ data: { name, date: new Date() } }))
            );
  
            // Combine existing and newly created categories
            const allCategories = [...categories, ...createdCategories];
  
            // Extract category IDs
            categoryIDs = allCategories.map(category => category.id);
        }
  
        // Update the post with the new data and category IDs
        await db.post.update({
            where: { id },
            data: {
                date,
                slug,
                categoryIDs,
                title,
                body,
            },
        });
        console.log('Post updated successfully!');
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : 'Something went wrong, try again later.'
    };
    }
      revalidatePath(paths.showSinglePost(id));
      redirect(paths.showSinglePost(id))  // redirect needs to be outside of try...catch
  
  }
  