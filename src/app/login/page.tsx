'use client'
import paths from '@/components/paths'
import SignIn from '@/components/signin'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
    const session = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session.status === 'authenticated') {
            router.push(paths.dashboard())
        }
    }, [session.status, router])

    let authContent: React.ReactNode
    if (session.status === 'loading') {
        authContent = null
    } else if (session.data?.user) {
        authContent = (
            <div>
                <div className="flex flex-col items-center gap-3">
                    Logged in as {session.data?.user.email}
                </div>
            </div>
        )
    } else {
        authContent = (
            <div>
                <SignIn />
            </div>
        )
    }

    return authContent
}
