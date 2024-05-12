'use server';
import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import paths from "@/components/paths";

interface FormState {
    message: string;
  }

  
export async function deletePost(formState:FormState, id: string) {
    try {
    await db.post.delete({
      where: { id }
    });
    console.log(`Post ${id} is deleted`);
  } catch (error) {
    // Catch any errors that occur during post creation
    return {
        message: error instanceof Error ? error.message : 'Something went wrong, try again later.'
    };
  }
      revalidatePath(paths.showAllPosts());
      redirect(paths.showAllPosts());
  } 
  