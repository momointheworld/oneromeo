import GridLayout from '@/components/grid'
import PostsByCategory from '@/components/posts/nav-posts'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'This Is Me, Arnold – I Want to Know What You Have to Say',
    description:
        'Everyone has a story to share, and I want to be the one to listen. I’ve been told I have empathy, and I want to use it to help others feel heard.',
}

export default function mePage() {
    return (
        <GridLayout>
            <PostsByCategory categoryName="About" />
        </GridLayout>
    )
}
