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
import * as action from '@/actions'
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TipTap from "@/components/editor";
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align';

interface FormDataProps {
    date: Date;
    slug: string;
    title: string;
    body: string;
}

function createSlug(title: string) {
    // Convert title to lowercase
    let slug = title.toLowerCase();
    // Replace spaces with underscores
    slug = slug.replace(/\s+/g, '_');
    // Remove special characters and punctuation marks
    slug = slug.replace(/[^\w-]/g, '');
    // Trim leading and trailing whitespace
    slug = slug.trim();
    return slug;
}

export default function CreatePost() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [title, setTitle] = useState('');

    const editor = useEditor({
        extensions: [
          StarterKit,
          TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
          Color.configure({ 
            types: [TextStyle.name, ListItem.name] }),
          TextStyle,
        
        ],
        content: '',
        // onUpdate({ editor }) {
        //     setEditorContent(editor.getHTML());
        //   },
      })
    const editorContent = editor?.getHTML();

const handleSumbit = async (event: React.FormEvent) => {
    event.preventDefault();
    const generatedSlug = createSlug(title); 
    const formData: FormDataProps = {
    date: selectedDate || new Date(),
    title,
    slug: generatedSlug,
    body: editorContent ?? '',
};
    // console.log(formData);
    // console.log(editorContent);
    await action.createPost(formData);
}

    return(
        <div>
        <form onSubmit={handleSumbit}>
                   <h3 className="text-center mb-8">Create a new blog</h3>
                <div className="flex flex-col gap-4 p-5">
                    <div className="flex gap-4">
                    <label htmlFor="date" className="w-20">Date</label>
                    <DatePicker 
                    id="date"
                    selected={selectedDate} 
                    onChange={(date) => setSelectedDate(date)}  
                    className="border rounded p-2 w-full"  />
                    </div>
                     <div className="flex gap-4">
                        <label htmlFor="title" className="w-20">Title</label>
                        <input 
                        className="border rounded p-2 w-full"
                        onChange={(e) => setTitle(e.target.value)}
                        name="title"
                        type="text" 
                        id="title"
                        />
                    </div>
                    <div className="container flex gap-4">
                    <span className="w-20">Date</span>
                    <TipTap editor={editor} />
                    </div>
                    <div className="flex gap-4 justify-end">
                    <button className="rounded bg-blue-500 shadow-md text-zinc-200 hover:text-zinc-900 shadow-stone-600 px-4 py-2">
                     Submit
                    </button>
                    </div>
                </div>
                </form> 
            </div>
    )
}
