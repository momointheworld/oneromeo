import GridLayout from '@/components/grid'
import PostsByCategory from '@/components/posts/nav-posts'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'My Animation Bits; The Way I Express Myself',
    description:
        'Here are some of my animation bits — videos from the past few years. They give you a glimpse into who I am, beyond listening, teaching, and exploring.',
}

export default function animationPage() {
    return (
        <GridLayout>
            <PostsByCategory categoryName="Animation" />
        </GridLayout>
    )
}
