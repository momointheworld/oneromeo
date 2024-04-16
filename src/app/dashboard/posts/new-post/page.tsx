'use client';
import { createPost } from '@/actions';
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
import Youtube from '@tiptap/extension-youtube'
import Link from 'next/link';
import { useFormState } from 'react-dom';
import DisplayPostMessage from '@/components/postMessage';

interface FormState {
  message: string;
  // Other properties related to your form state
}
interface FormDataProps {
    date: Date;
    slug: string;
    title: string;
    categoryNames: string[];
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
    const categories = ['Thoughts', 'Work', 'Hobby'];
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['Work']); // Set default category to 'Work'
    const [formState, action] = useFormState(createPost, {message: ''});
    const formStateMessage = formState.message;
  
    // Editor config
    const editor = useEditor({
        extensions: [
          StarterKit,
          TextAlign.configure({
            types: ['heading', 'paragraph'],
          }),
          Color.configure({ 
            types: [TextStyle.name, ListItem.name] }),
          TextStyle,
          Youtube.configure({
            controls: false,
          }),
        ],
        content: '',
        // onUpdate({ editor }) {
        //     setEditorContent(editor.getHTML());
        //   },
      })
    const editorContent = editor?.getHTML();

    const widthRef = React.useRef<HTMLInputElement>(null);
    const heightRef = React.useRef<HTMLInputElement>(null);
  
    React.useEffect(() => {
        if (widthRef.current && heightRef.current) {
        setWidthAndHeight();
        }
    }, [])

  const setWidthAndHeight = () => {
    widthRef.current!.value = '320';
    heightRef.current!.value = '180';
  };

   const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL');
      
        if (url) {
          const widthValue = widthRef.current?.value ? parseInt(widthRef.current.value, 10) : null;
          const heightValue = heightRef.current?.value ? parseInt(heightRef.current.value, 10) : null;
      
          const width = Math.max(320, widthValue || 448);
          const height = Math.max(180, heightValue || 336);
      
          editor?.commands.setYoutubeVideo({
            src: url,
            width,
            height,
          });
        }
      };
      

      // form input
const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedCategories(selectedOptions);
    };

    const generatedSlug = createSlug(title); 
    const formData: FormDataProps = {
    date: selectedDate || new Date(),
    title,
    categoryNames: selectedCategories,
    slug: generatedSlug,
    body: editorContent ?? '',
}
    
return(
        <div>
             <div className="my-5">
             <Link href={'/dashboard/'}>Dashboard</Link> {"\u00AB"} <Link href={'/dashboard/posts'}>Posts</Link> {"\u00AB"} New Post
            </div>
          {/* formState error message */}
          <DisplayPostMessage formStateMessage={formStateMessage} />
            {/* Form input */}
        <form action={(event) => action(formData)}>
         <h3 className="text-center mb-8">Create a new post</h3>
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
                    <label htmlFor="category" className="w-20">Category</label>
                    <select
                        className="border rounded p-2"
                        onChange={handleCategoryChange}
                        name="category"
                        id="category"
                        multiple // Allow multiple selections
                        value={selectedCategories} // Controlled component
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
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
                    <TipTap editor={editor} onYoutubeClick={addYoutubeVideo} widthRef={widthRef} heightRef={heightRef}/>
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
