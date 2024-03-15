'use server';
import { db } from "@/db";
import { redirect } from "next/navigation";

interface FormDataProps {
    date: Date,
    title: string,
    slug: string,
    body: string,
}

export async function createPost(formData: FormDataProps) {
    const { date, slug, title, body } = formData;
    const post = await db.post.create({
        data: {
            date,
            slug,
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
