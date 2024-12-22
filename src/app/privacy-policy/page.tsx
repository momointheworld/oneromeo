import PostsByCategory from '@/components/posts/nav-posts'
import GridLayout from '@/components/grid'
import { Metadata } from 'next/types'

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description:
        'Review how I protect your personal information at OneRomeo.com. I explain how I collect, use, and safeguard your data to ensure your privacy is respected.',
}

export default function PrivacyPage() {
    return (
        <GridLayout>
            <PostsByCategory categoryName="Privacy" />
        </GridLayout>
    )
}
