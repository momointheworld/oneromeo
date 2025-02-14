import GridLayout from '@/components/grid'
import PostsByCategory from '@/components/posts/nav-posts'
import TestimonialsComponent from '@/components/testimonialsComponent'

export default function EbookPage() {
    return (
        <GridLayout>
            <PostsByCategory categoryName="Ebook" />
            <TestimonialsComponent productName="book" />
        </GridLayout>
    )
}
