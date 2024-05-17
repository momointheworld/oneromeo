import { Button } from "@nextui-org/react";
import { signOut } from "@/actions";
import { useSession } from "next-auth/react"

export default function SignOut() {
    const { data: session} = useSession()
   
    return(
        <form action={signOut}>
            <div className="flex flex-row items-center justify-center gap-2">
            <p>{session?.user?.name}</p>
            <Button color="danger" variant="ghost"size="sm" type="submit">Sign Out</Button>
            </div>
        </form>
    )
}