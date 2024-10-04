import { signIn } from '@/actions'
import FormButton from './common/formbutton'

export default function SignIn() {
    return (
        <div className="flex flex-col">
            <p>Please log in to manage dashboard.</p>
            <form action={signIn}>
                <FormButton color="primary">Sign In</FormButton>
            </form>
        </div>
    )
}
