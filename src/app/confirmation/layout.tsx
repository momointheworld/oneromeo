import { Metadata } from 'next'

// Contact page is a client component, so it needs a separate layout component
export const metadata: Metadata = {
    title: 'Order Confirmation - Thanks!',
    description:
        'Thank you for your purchase! This is your order confirmation. Have a great day!',
}

export default function ConfirmationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div>{children}</div>
}
