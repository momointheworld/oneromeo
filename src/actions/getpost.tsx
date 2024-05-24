'use server';
import { db } from "@/db";
import { Post } from "@prisma/client";
import { notFound } from "next/navigation";
import { cache } from "react";

interface GetPostProps {
    id: string; // Define 'id' directly in the interface
  }
  
  export const getPost = cache(async (props: GetPostProps): Promise<Post> => {
    
    const { id} = props;
    const post = await db.post.findFirst({
        where: { id }, 
    });
    if (!post) {
        return notFound();
    }
    return post;
  })