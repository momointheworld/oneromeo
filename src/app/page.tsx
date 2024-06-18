import GridLayout from '@/components/grid'
import PostsByCategory from '@/components/posts/nav-posts'

export const revalidate = 60 // re-render in every 60 seconds
export default function HomePage() {
    return (
        <GridLayout>
            <PostsByCategory categoryName="Blog" />
        </GridLayout>
    )
}
