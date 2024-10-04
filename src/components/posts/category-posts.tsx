import * as action from '@/actions'
import { format } from 'date-fns' // Import format function from date-fns
import Link from 'next/link'

async function DisplayPostsByCategory(): Promise<void> {
    try {
        const postsByCategory = await action.fetchAndGroupPostsByCategory()
        if (!postsByCategory) {
            console.log('No posts found or error occurred.')
            return
        }

        Object.entries(postsByCategory).forEach(
            ([categoryId, categoryPosts]) => {
                console.log(`Category: ${categoryId}`)
                categoryPosts.forEach((post) => {
                    const formattedDate = format(
                        new Date(post.date),
                        'MMMM d, yyyy'
                    )
                    console.log(`- ${formattedDate} | ${post.title} | view`)

                    // Render the post as a Link
                    return (
                        <Link
                            key={post.id}
                            href={`/dashboard/posts/${post.id}`}
                            className="flex justify-between items-center p-2 border rounded hover:bg-stone-50 no-underline"
                        >
                            <div className="text-zinc-500">
                                {formattedDate} | {post.title}
                            </div>
                            <div>{post.categoryIDs}</div>
                            <div>view</div>
                        </Link>
                    )
                })
            }
        )
    } catch (error) {
        console.error('Error displaying posts by category:', error)
    }
}

export default DisplayPostsByCategory
