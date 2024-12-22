import GridLayout from '@/components/grid'
import PostsByCategory from '@/components/posts/nav-posts'
import { Metadata } from 'next/types'

export const metadata: Metadata = {
    title: 'Terms of Use',
    description:
        'Review the Terms of Use for OneRomeo.com. I’ve outlined how my services work, the rules for using the site, and what to expect.',
}
export default function TermsPage() {
    return (
        <GridLayout>
            <PostsByCategory categoryName="Terms" />
        </GridLayout>
    )
}
