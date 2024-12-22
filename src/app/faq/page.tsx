import PostsByCategory from '@/components/posts/nav-posts'
import GridLayout from '@/components/grid'
import { Metadata } from 'next/types'

export const metadata: Metadata = {
    title: 'FAQs | Listening Sessions',
    description:
        'Have questions about OneRomeo.com’s listening sessions? Visit the FAQ for answers, and I’m here to clarify anything else you need.',
}
export default function PrivacyPage() {
    return (
        <GridLayout>
            <PostsByCategory categoryName="FAQ" />
        </GridLayout>
    )
}
