import GridLayout from '@/components/grid'
import PostsByCategory from '@/components/posts/nav-posts'

export default function mePage() {
    return (
        <GridLayout>
            <PostsByCategory categoryName="About" />
        </GridLayout>
    )
}
