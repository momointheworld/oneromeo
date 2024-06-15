import PostsByCategory from '@/components/posts/nav-posts'
import GridLayout from '@/components/grid'

export default function PrivacyPage() {
    return (
        <GridLayout>
            <PostsByCategory categoryName="Privacy" />
        </GridLayout>
    )
}
