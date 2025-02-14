import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Not in a Million Years: My Story, Novel, and eBook',
    description:
        "I wrote this story about a law student many years after graduation. I guess I had to digest it all first. It's out now, though. My first novel/eBook.",
}

export default function EbookLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div>{children}</div>
}
