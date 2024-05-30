'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { fetchAndGroupPostsByCategory, getAllCategories } from '@/actions';
import paths from '@/components/paths';
import PageBreadcrumbs from '@/components/common/breadcrumbs';
import { Button } from '@nextui-org/react';
import { FullSkeleton } from '@/components/common/skeleton-loading';

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

interface Breadcrumb {
    href: string;
    text: string;
  }
  
 
export default function RenderAllPosts(): JSX.Element {
    const [groupedPosts, setGroupedPosts] = useState<GroupedPosts | null>(null);
    const [categories, setCategories] = useState<Category[] | null>(null);
    const breadcrumbs: Breadcrumb[] = [
        { href: paths.dashboard(), text: 'Dashboard' },
        { href: paths.showAllPosts(), text: 'Posts' },
    ];

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
      }, []);
      

    const renderPosts = () => {
      if (!groupedPosts || !categories) {
          return <div><FullSkeleton /></div>;
      }

      return categories.map(category => (
        <div key={category.id}>
            <h2>
                <Link href={paths.showCategoryPosts(category.id)}>{category.name}</Link>
            </h2>
            {/* Slice the posts array to display only 6 posts */}
            {groupedPosts[category.id]?.slice(0, 6).map(post => (
                <Link
                    key={post.id}
                    href={paths.showSinglePost(post.id)}
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
           
            <PageBreadcrumbs items={breadcrumbs} />
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">Posts</h1>
                <div>
                    <Button variant='bordered' color='primary'>
                    <Link
                        href={paths.createNewPost()}
                        className="no-underline"
                    >
                        Create Post
                    </Link>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-5">{renderPosts()}</div>
             
        </div>
    );
}
