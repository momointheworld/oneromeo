import GridLayout from '@/components/grid'
import PostsByCategory from '@/components/posts/nav-posts'

export default function HomePage() {
    return (
        <GridLayout>
            <PostsByCategory categoryName="Blog" />
        </GridLayout>
    )
}
