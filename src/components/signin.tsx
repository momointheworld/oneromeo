import { Button } from '@nextui-org/react'
import { signIn } from '@/actions'

export default function SignIn() {
    return (
        <div className="flex flex-col">
            <p>Please log in to manage dashboard.</p>
            <form action={signIn}>
                <Button color="primary" variant="ghost" type="submit">
                    Sign In
                </Button>
            </form>
        </div>
    )
}
