import { Button } from "@nextui-org/react";
import { signIn } from "@/actions";

export default function SignIn() {
   
    return(
        <form action={signIn}>
        <Button type="submit">Sign In</Button>
        </form>
    )
}