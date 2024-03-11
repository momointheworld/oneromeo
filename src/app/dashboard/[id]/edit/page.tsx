import { db } from "@/db";
import { notFound } from "next/navigation";

interface EditPostProps {
    params: {
        id: string
        title: string
    }
}

export default async function EditPost(props:EditPostProps) {
   // In MongoDB the ID is an object
   const postId = props.params.id;
const post = await db.post.findFirst({
    where: {id : postId }
})
if (!post) {
    return notFound();
}

   return (

    <div> Editing the post of {post.title}</div>
   )
}