'use server';
import { db } from "@/db";
import { notFound } from "next/navigation";

export async function getCategoryPosts(categoryId: string) {
    try {
      // Find the posts associated with the category ID
      const posts = await db.post.findMany({
          where: {
            categoryIDs: {
              has:categoryId,
            },
          },
         orderBy: {
          date: 'desc', 
        },
      });
  
      return posts; // Return the posts associated with the category
    } catch (error) {
      console.error('Error fetching category posts:', error);
      return notFound();
    }
  }
  