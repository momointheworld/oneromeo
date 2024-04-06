// import { format } from 'date-fns';
// import Link from "next/link";
// import { db } from "@/db"

// export default async function AllPosts() {
//     const posts = await db.post.findMany();
//     const renderPosts = posts.map((post)=> {
//       const formattedDate = format(new Date(post.date), 'MMMM d, yyyy');
//         return (
//           <Link 
//           key={post.id}
//           href={`/dashboard/posts/${post.id}`}
//           className="flex justify-between items-center p-2 border rounded no-underline"
//           >
//             <div className='text-zinc-500'>{formattedDate} | {post.title}</div> 
//             <div>view</div>
//           </Link>
//         )
//     })

//     return(
//         <div className='flex flex-col'>
//          <div className="my-5">
//          <Link href={'/dashboard/'}>Dashboard</Link> {"\u00AB"} Posts
//             </div>
//         <div className="flex justify-between items-center">
//             <h1 className="text-xl font-bold">Posts</h1>
//             <div>
//             <Link href={'/dashboard/posts/new-post'} className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline">Create Post</Link>
//             </div>
//         </div>
//         <div className="flex flex-col gap-2 mt-5">
//       {renderPosts}
//       </div>
//       </div>
//     )
// }
'use client';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { fetchAndGroupPostsByCategory, getAllCategories } from '@/actions';

interface Post {
    id: string;
    title: string;
    date: Date;
}

interface GroupedPosts {
    [key: string]: Post[];
}
interface Category {
  id: string;
  name: string;
  posts: Post[];
}
 
export default function AllPosts(): JSX.Element {
    const [groupedPosts, setGroupedPosts] = useState<GroupedPosts | null>(null);
    const [categories, setCategories] = useState<Category[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            const posts = await fetchAndGroupPostsByCategory();
            setGroupedPosts(posts);
        }
        fetchData();
    }, []);

    useEffect(() => {
      async function fetchCategories() {
        const categories = await getAllCategories();
        setCategories(categories);
      }
      fetchCategories();
    })

    const renderPosts = () => {
      if (!groupedPosts || !categories) {
          return <div>Loading...</div>;
      }

      return categories.map(category => (
        <div key={category.id}>
            <h2>
                <Link href={`/dashboard/posts/categories/${category.id}`}>{category.name}</Link>
            </h2>
            {/* Slice the posts array to display only 15 posts */}
            {groupedPosts[category.id]?.slice(0, 6).map(post => (
                <Link
                    key={post.id}
                    href={`/dashboard/posts/${post.id}`}
                    className="flex justify-between items-center p-2 border rounded no-underline"
                >
                    <div className="text-zinc-500">
                        {format(new Date(post.date), 'MMMM d, yyyy')} | {post.title}
                    </div>
                    <div>view</div>
                </Link>
            ))}
        </div>
    ));
};

    return (
        <div className="flex flex-col">
            <div className="my-5">
                <Link href={'/dashboard/'}>Dashboard</Link> {'\u00AB'} Posts
            </div>
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Posts</h1>
                <div>
                    <Link
                        href={'/dashboard/posts/new-post'}
                        className="border p-2 mx-1 rounded bg-blue-200 hover:bg-blue-600 hover:text-zinc-200 no-underline"
                    >
                        Create Post
                    </Link>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-5">{renderPosts()}</div>
        </div>
    );
}
