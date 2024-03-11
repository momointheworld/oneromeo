'use server';
import { db } from "@/db";
import { redirect } from "next/navigation";
import { parse, formatISO } from 'date-fns'; 

interface FormDataProps {
    date: string,
    slug: string,
    title: string,
    body: string
}

export async function createPost(formData: FormDataProps) {
    const { date, slug, title, body } = formData;
    const parsedDate = parse(date, 'yyyyMMdd', new Date()); 
    const post = await db.post.create({
        data: {
            date: parsedDate,
            slug,
            title,
            body
        }
     });
     console.log(post);
     console.log(date);
     redirect('/dashboard');
}

export async function editPost() {
    console.log("calling db");
    
}
