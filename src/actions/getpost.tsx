'use server';
import { db } from "@/db";
import { notFound } from "next/navigation";

interface GetPostProps {
    id: string; // Define 'id' directly in the interface
  }
  
  export async function getPost(props: GetPostProps): Promise<any> {
    const { id} = props;
    const post = await db.post.findFirst({
        where: { id }, 
    });
    if (!post) {
        return notFound();
    }
    return post;
  }