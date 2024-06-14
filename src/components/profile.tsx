'use client'
import Image from 'next/image'
import Logo from '/public/sparrow.svg'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { signOut } from '@/actions'
import { useSession } from 'next-auth/react'
import { useCallback, useState } from 'react'
import paths from './paths'
import { Link } from '@nextui-org/react'
import SignIn from './signin'
import FormButton from './common/formbutton'

export default function Profile() {
    const { data: session, status } = useSession()
    const imageUrl = session?.user?.image || Logo
    const [popoverOpen, setPopoverOpen] = useState(false)

    let authContent: React.ReactNode

    const handleImageClick = useCallback(() => {
        setPopoverOpen((prev) => !prev)
    }, [])

    const handleSignOut = async () => {
        await signOut() // Perform sign out without redirect
        setPopoverOpen(false) // Close popover
        window.location.href = '/login' // Redirect to sign-in page
    }

    const AuthenticatedUser = () => (
        <div>
            {imageUrl && (
                <div onClick={handleImageClick} className="w-3/5">
                    <Image
                        src={imageUrl}
                        alt="User Avatar"
                        width={50}
                        height={50}
                        className="rounded-full shadow-lg"
                        priority
                    />
                </div>
            )}

            <Popover
                isOpen={popoverOpen}
                onClose={() => setPopoverOpen(false)}
                placement="bottom"
                className="z-50"
            >
                <PopoverTrigger>
                    <div onClick={handleImageClick}></div>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="flex flex-col justify-items-center p-4 gap-2 text-center">
                        <p>Hey {session?.user?.name}</p>
                        <Link href={paths.dashboard()}>Dashboard</Link>
                        <form action={handleSignOut}>
                            <FormButton color="danger">Sign Out</FormButton>
                        </form>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )

    if (status === 'loading') {
        authContent = null
    } else if (session?.user) {
        authContent = <AuthenticatedUser />
    } else {
        authContent = <SignIn />
    }

    return <div>{authContent}</div>
}
