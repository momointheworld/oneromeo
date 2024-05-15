// pages/dashboard/posts/category/[categoryId].tsx
'use client';
import React, {useEffect, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { getAllCategories, getCategoryPosts } from '@/actions';
import paths from '@/components/paths';
import PageBreadcrumbs from '@/components/common/breadcrumbs';

interface Post {
    id: string;
    title: string;
    date: Date;
}

interface CategoryProps {
    params: {id: string };
}

interface Category {
    id: string;
    name: string;
  }

  interface Breadcrumb {
    href: string;
    text: string;
  }


export default function CategoryPosts({params}: CategoryProps ){
    const { id } = params;
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[] | null>(null);
    const breadcrumbs: Breadcrumb[] = [
        { href: paths.dashboard(), text: 'Dashboard' },
        { href: paths.showAllPosts(), text: 'Posts' },
        { href: paths.showAllCategories(), text: 'Categories' },
        { href: paths.showCategoryPosts(id), text: `${categoryName}` },
    ];
    useEffect(() => {
        async function fetchData() {
            // Get the category ID from the route query parameters
        //   const categoryId = params.id
        //   console.log(categoryId);
            const postsData = await getCategoryPosts(id);
            setPosts(postsData || []);
        }
        fetchData();
    }, [id]);
    
    useEffect(() => {
        async function fetchCategories() {
            const categoriesArr = await getAllCategories();
            setCategories(categoriesArr);
        }
        fetchCategories(); // Call fetchCategories to fetch all categories
    }, []);

    useEffect(() => {
        if (categories) {
            const categoryId = params.id;
            const foundCategory = categories.find(category => category.id === categoryId);
            if (foundCategory) {
                setCategoryName(foundCategory.name);
            }
        }
    }, [params.id, categories]);


    return (
        <div>
             <PageBreadcrumbs items={breadcrumbs} />
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
