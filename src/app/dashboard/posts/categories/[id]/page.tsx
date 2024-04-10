// pages/dashboard/posts/category/[categoryId].tsx
'use client';
import React, {useEffect, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { getAllCategories, getCategoryPosts } from '@/actions';

interface Post {
    id: string;
    title: string;
    date: Date;
}

interface CategoryProps {
    params: any;
    id: string;
    name: string;
  }
interface Category {
    id: string;
    name: string;
  }

export default function CategoryPosts(props: CategoryProps ): JSX.Element {
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            // Get the category ID from the route query parameters
          const categoryId = props.params.id
        //   console.log(categoryId);
            const postsData = await getCategoryPosts(categoryId);
            setPosts(postsData || []);
        }
        fetchData();
    }, [props.params.id]);
    
    useEffect(() => {
        async function fetchCategories() {
            const categoriesArr = await getAllCategories();
            setCategories(categoriesArr);
        }
        fetchCategories(); // Call fetchCategories to fetch all categories
    }, []);

    useEffect(() => {
        if (categories) {
            const categoryId = props.params.id;
            const foundCategory = categories.find(category => category.id === categoryId);
            if (foundCategory) {
                setCategoryName(foundCategory.name);
            }
        }
    }, [props.params.id, categories]);


    return (
        <div>
            <div className="p-3 my-5">
            <Link href={'/dashboard/'}>Dashboard</Link> {"\u00AB"} <Link href={'/dashboard/posts/'}>Posts</Link> {"\u00AB"} <Link href={'/dashboard/posts/categories'}>Categories</Link> {"\u00AB"} {categoryName}
            </div>
            <h2>Posts for {categoryName}</h2>
            {posts ? (
                <div className="flex flex-col gap-2 mt-5">
                    {posts.map(post => (
                        <div key={post.id}>
                            <Link href={`/dashboard/posts/${post.id}`} 
                            className="flex justify-between items-center p-2 border rounded no-underline">
                                    {format(new Date(post.date), 'MMMM d, yyyy')} - {post.title}
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}
