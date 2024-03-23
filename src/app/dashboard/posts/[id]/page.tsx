import Link from "next/link";
import parse from 'html-react-parser';
import { notFound } from "next/navigation";
import { format } from 'date-fns';
import { db } from "@/db";

interface ShowPostProps {
    params: {
        id: string
    }
}

export default async function ShowPost(props: ShowPostProps) {
    // In MongoDB the ID is an object
    const postId = props.params.id;
    const post = await db.post.findFirst({
        where: { id: postId }
    })
    if (!post) {
        return notFound();
    }
    return(
        <div>
            <div className="p-3 my-5">
            <Link href={'/dashboard/'}>Dashboard</Link> {"\u00AB"} <Link href={'/dashboard/posts'}>posts</Link> {"\u00AB"} {post.title}
            </div>
            <h1>{post.title}</h1>
        <div className="flex justify-between">
            <div className="flex gap-x-5">
            <Link href={`/dashboard/posts/${postId}/edit`} className="p-3 border rounded border-blue-400 no-underline hover:bg-blue-400">Edit</Link>
            <Link  href={`/dashboard/posts/${postId}/delete`} className="p-3 border rounded border-red-400 no-underline hover:bg-red-200">Delete</Link>
            </div>
            <div className="self-end">{format(new Date(post.date), 'MMMM d, yyyy')}</div>
        </div>
        <div className="p-2 mt-4">
            { parse(post.body)}
        </div>
        </div>
    )
}