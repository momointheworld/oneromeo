'use client';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { getAllCategories } from "@/actions";

interface Post {
    id: string;
    title: string;
    date: Date;
}

interface Category {
    id: string;
    name: string;
    posts: Post[];
}

export default function CategoryPosts(): JSX.Element {
    const [categories, setCategories] = useState<Category[] | null>(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const categories = await getAllCategories();
                setCategories(categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchCategories();
    }, []);

    return (
        <div>
              <div className="p-3 my-5">
            <Link href={'/dashboard/'}>Dashboard</Link> {"\u00AB"} <Link href={'/dashboard/posts/'}>Posts</Link> {"\u00AB"} categories
            </div>
            <h2>All Categories</h2>
            <div className="flex flex-row gap-4 justify-start">
            {categories ? (
                categories.map((category) => (
                    <div key={category.id}>
                        <Link href={`/dashboard/posts/categories/${category.id}`}>
                            {category.name}
                        </Link>
                    </div>
                ))
            ) : (
                <div>Loading categories...</div>
            )}
            </div>
        </div>
    );
}
