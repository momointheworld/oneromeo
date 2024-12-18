import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Providers from '@/app/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: {
        default: 'I’m Here to Listen – Personal Listening, 100% Confidential',
        template: '%s | One Romeo',
    },
    description:
        'A 100% confidential space for you to share your thoughts freely. No catch, just you and me. I’m here to listen and help you feel better.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <Header />
                    <main className="prose md:container mx-auto mt-10 rounded-md mx-5 min-h-screen">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    )
}
