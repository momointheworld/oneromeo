// This component will render all posts on one single page, different from the dashboard/category/post page
// mainly used for the nav bar posts
'use client';
import * as actions from '@/actions';
import parse from 'html-react-parser';
import { useEffect, useState } from "react";

interface Post {
    id: string;
    date: Date;
    title: string;
    slug: string;
    categoryIDs: string[];
    body: string;
}

interface Category {
    id: string;
    name: string;
}

interface PostsByCategoryProps {
    categoryName: string;
}

export default function PostsByCategory({ categoryName }: PostsByCategoryProps) {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [fetchedPosts, setFetchedPosts] = useState<Post[] | null>(null);

    useEffect(() => {
        async function fetchCategories() {
            const categoriesArr = await actions.getAllCategories();
            setCategories(categoriesArr);
        }
        fetchCategories(); // Call fetchCategories to fetch all categories
    }, []);

    useEffect(() => {
        async function fetchPosts() {
            if (categories) {
                const category = categories.find((category) => category.name === categoryName);
                if (category) {
                    const posts = await actions.getCategoryPosts(category.id);
                    setFetchedPosts(posts);
                }
            }
        }
        fetchPosts();
    }, [categories, categoryName]);

    return (
        <div>
             {/* Render fetched posts here */}
             {fetchedPosts && (
                <div>
                    <article>
                        {fetchedPosts.map((post) => (
                            <div key={post.id}> 
                            <h2 className='text-center'>{post.title}</h2>
                            { parse(post.body)}
                            </div>
                        ))}
                    </article>
                </div>
            )}
        </div>
    );
}
