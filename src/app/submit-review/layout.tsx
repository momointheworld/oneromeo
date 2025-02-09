import { Metadata } from 'next'

// Contact page is a client component, so it needs a separate layout component
export const metadata: Metadata = {
    title: 'Submit a Review to Make a Difference',
    description:
        'Let others know what you think! Your review matters. Thank you X 1000! Honestly, I don’t know what I’d do without you!',
}

export default function SubmitReviewLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div>{children}</div>
}
