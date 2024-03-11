//  import { redirect } from "next/navigation";
//  import { db } from "@/db";
//  import { parse, formatISO } from 'date-fns'; 

// export default function CreatePost() {
//     async function createPost(formData: FormData) {
//          'use server';
//          const dateString = formData.get('date') as string;
//          const date = parse(dateString, 'yyyyMMdd', new Date()); 
//          const isoDateString = formatISO(date); 
//          const slug = formData.get('slug') as string;
//          const title = formData.get('title') as string;
//          const body = formData.get('body') as string;
//          const post = await db.post.create({
//             data: {
//                 date: isoDateString,
//                 slug,
//                 title,
//                 body
//             }
//          });
//          console.log(post);
//          console.log(date);
         
//          redirect('/dashboard');
//     }

//     return(
//         <form action={createPost}>
//             <h3 className="text-center mb-8">Create a new blog</h3>
//         <div className="flex flex-col gap-4 p-5">
//         <div className="flex gap-4">
//                 <label htmlFor="date" className="w-20">Date</label>
//                 <input 
//                 className="border rounded p-2"
//                 name="date"
//                 type="text" 
//                 id="date"
//                 />
//             </div>
//             <div className="flex gap-4">
//                 <label htmlFor="slug" className="w-20">Slug</label>
//                 <input 
//                 className="border rounded p-2 w-full"
//                 name="slug"
//                 type="text" 
//                 id="slug"
//                 />
//             </div>
//              <div className="flex gap-4">
//                 <label htmlFor="title" className="w-20">Title</label>
//                 <input 
//                 className="border rounded p-2 w-full"
//                 name="title"
//                 type="text" 
//                 id="title"
//                 />
//             </div>
//             <div className="container flex gap-4">
//                 <label htmlFor="body" className="w-20">Content Body</label>
//                 <textarea 
//                 className="border rounded p-2 w-full"
//                 name="body" 
//                 rows={10}
//                 id="body"
//                 />
//             </div>
//             <div className="flex gap-4 justify-end">
//             <button className="rounded bg-blue-500 shadow-md text-zinc-200 hover:text-zinc-900 shadow-stone-600 px-4 py-2">
//              Submit
//             </button>
//             </div>
//         </div>
//         </form>
//     )
// }

'use client'
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Editor from "@/components/editor";


export default function CreatePost() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [slug, setSlug] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

const handleSumbit = () => {
    console.log(title);
    
}

    return(
        <form onSubmit={handleSumbit}>
                   <h3 className="text-center mb-8">Create a new blog</h3>
                <div className="flex flex-col gap-4 p-5">
                    <div className="flex gap-4">
                    <label htmlFor="date" className="w-20">Date</label>
                    <DatePicker 
                    selected={selectedDate} 
                    onChange={(date) => setSelectedDate(date)}  
                    className="border rounded p-2 w-full"  />
                    </div>
                    <div className="flex gap-4">
                        <label htmlFor="slug" className="w-20">Slug</label>
                        <input 
                        className="border rounded p-2 w-full"
                        name="slug"
                        type="text" 
                        id="slug"
                        />
                    </div>
                     <div className="flex gap-4">
                        <label htmlFor="title" className="w-20">Title</label>
                        <input 
                        className="border rounded p-2 w-full"
                        name="title"
                        type="text" 
                        id="title"
                        />
                    </div>
                    <div className="container flex gap-4">
                        <label htmlFor="body" className="w-20">Content Body</label>
                      <Editor />
                    </div>
                    <div className="flex gap-4 justify-end">
                    <button className="rounded bg-blue-500 shadow-md text-zinc-200 hover:text-zinc-900 shadow-stone-600 px-4 py-2">
                     Submit
                    </button>
                    </div>
                </div>
                </form> 
    )
}
