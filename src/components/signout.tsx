// import Image from 'next/image'
// import Logo from '/public/sparrow.svg'
// import { Button } from '@nextui-org/react'
// import { signOut } from '@/actions'
// import { useSession } from 'next-auth/react'

// export default function SignOut() {
//     const { data: session } = useSession()
//     const imageUrl = session?.user?.image || Logo

//     return (
//         <form action={signOut}>
//             <div className="flex flex-row items-center justify-center gap-2">
//                 {/* <p>{session?.user?.name}</p> */}

//                 {imageUrl && (
//                     <Image
//                         className="hidden md:flex justify-self-end pt-3 mx-5 aspect-ratio"
//                         src={imageUrl}
//                         alt="User Avatar"
//                         width={50} // Specify width and height to avoid layout shift
//                         height={50}
//                         priority
//                     />
//                 )}
//                 <Button color="danger" variant="ghost" size="sm" type="submit">
//                     Sign Out
//                 </Button>
//             </div>
//         </form>
//     )
// }

import Image from 'next/image'
import Logo from '/public/sparrow.svg'
import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@nextui-org/react'
import { signOut } from '@/actions'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import paths from './paths'
import { Link } from '@nextui-org/react'

export default function SignOut() {
    const { data: session } = useSession()
    const imageUrl = session?.user?.image || Logo
    const [popoverOpen, setPopoverOpen] = useState(false)

    const handleImageClick = () => {
        setPopoverOpen(!popoverOpen)
    }

    return (
        // <div className="flex flex-row items-center justify-center gap-2">
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
                        <form action={signOut}>
                            <Button
                                color="danger"
                                variant="ghost"
                                size="sm"
                                type="submit"
                            >
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
