import GridLayout from '@/components/grid'
import PostsByCategory from '@/components/posts/nav-posts'

export default function TermsPage() {
    return (
        <GridLayout>
            <PostsByCategory categoryName="Terms" />
        </GridLayout>
    )
}
