import { Button } from "@nextui-org/react";
import { signOut } from "@/actions";

export default function SignOut() {
   
    return(
        <form action={signOut}>
        <Button type="submit">Sign Out</Button>
        </form>
    )
}