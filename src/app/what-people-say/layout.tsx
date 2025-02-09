import { Metadata } from 'next'

// Contact page is a client component, so it needs a separate layout component
export const metadata: Metadata = {
    title: 'What People Say (Testimonials)',
    description:
        'See what people are saying about my eBook and listening sessions. Read the reviews and join the conversation to share your thoughts or learn more!',
}

export default function TestimonialLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div>{children}</div>
}
