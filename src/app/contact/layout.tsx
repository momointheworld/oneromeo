import { Metadata } from 'next'

// Contact page is a client component, so it needs a separate layout component
export const metadata: Metadata = {
    title: 'Say Hello | Listening Sessions',
    description:
        'Reach out to me at OneRomeo.com for any questions or to schedule your listening session. I’m here to help with whatever you need.',
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div>{children}</div>
}
