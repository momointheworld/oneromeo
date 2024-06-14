'use server'
import * as auth from '@/auth'

export async function signOut() {
    // Sign out the user
    await auth.signOut()
}
