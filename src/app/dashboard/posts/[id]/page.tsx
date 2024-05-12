'use client';
import Link from "next/link";
import parse from 'html-react-parser';
import { notFound } from "next/navigation";
import { format } from 'date-fns';
import { deletePost, getAllCategories, getPost } from '@/actions';
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import paths from "@/components/paths";
import PageBreadcrumbs from "@/components/common/breadcrumbs";

interface ShowPostProps {
    params: {
        id: string,
    }
}

interface Breadcrumb {
    href: string;
    text: string;
  }

export default function ShowSinglePost(props: ShowPostProps) {
// In MongoDB the ID is an object
const postId = props.params.id;
const [post, setPost] = useState<any>(null);
const breadcrumbs: Breadcrumb[] = [
    { href: paths.dashboard(), text: 'Dashboard' },
    { href: paths.showAllPosts(), text: 'Posts' },
    { href: paths.showSinglePost(postId), text: post?.title },
];
// const [postSlug, setPostSlug] = useState<any>(null);
const [message, setMessage] = useState('');
const [messageVisible, setMessageVisible] = useState(false);  
const [formState, action] = useFormState(deletePost, { message: '' });
const [categories, setCategories] = useState<any[]>([]);

   // Effect to handle message visibility and close button visibility
   useEffect(() => {
    if (formState.message) {
        setMessage(formState.message); // Set the message
        setMessageVisible(true); // Show the message
    } else {
        setMessage(''); // Clear the message if there's no message to display
        setMessageVisible(false); // Hide the message
    }
}, [formState.message]);

useEffect(() => {
    async function fetchData() {
        const fetchedPost = await getPost({ id: postId});
        setPost(fetchedPost);
        // setPostSlug(post.slug);
        const fetchedCategories = await getAllCategories();
        // filter the category by the category ID existing
        const filteredCategories = fetchedCategories.filter(category => fetchedPost.categoryIDs.includes(category.id));
        setCategories(filteredCategories);
    }

    fetchData();
}, [postId]); // Run the effect whenever postId changes



if (!post) {
    return <div>Loading...</div>;
}

if (!categories.every(Boolean)) {
    return notFound(); // Handle the case where any category is not found
}


// Extract category names from fetched categories
const categoryNames = categories.map(category => category?.name);

// Function to handle closing the message
const closeMessage = () => {
    setMessage(''); // Clear the message
    setMessageVisible(false); // Hide the message
};

    return(
        <div>
             <PageBreadcrumbs items={breadcrumbs}/>
            <h1>{post.title}</h1>
            {/* formState error message */}
            {messageVisible && (
                <div className='bg-red-200 text-gray-700 px-5 rounded flex flex-row justify-between'>
                 <p className='self-center'> {formState.message} </p>
                    <button 
                        className="font-bold hover:text-gray-700"
                        onClick={closeMessage}
                    >
                        &times;
                    </button>
                </div>
            )}
        <div className="flex justify-between">
            <div className="flex gap-x-5">
            <Link href={`/dashboard/posts/${postId}/edit`} className="p-3 border rounded border-blue-400 no-underline hover:bg-blue-400">Edit</Link>
            <form action={(e)=> {action(postId)}} className="p-3 border rounded border-red-400 no-underline hover:bg-red-200">
              <button> Delete</button>
                </form>
            </div>
            <div className="self-end">Categories: {categoryNames.join(', ')} | {format(new Date(post.date), 'MMMM d, yyyy')}</div> 
        </div>
        <div className="p-2 mt-4">
            { parse(post.body)}
        </div>
        </div>
    )
}