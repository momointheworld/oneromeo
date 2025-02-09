import GridLayout from '@/components/grid'
import PostsByCategory from '@/components/posts/nav-posts'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'My Animation Bits; The Way I Express Myself',
    description:
        'A collection of short video clips where I experiment with animation, storytelling, and creativity to express myself.',
}

export default function animationPage() {
    return (
        <GridLayout>
            <PostsByCategory categoryName="Animation" />
        </GridLayout>
    )
}
