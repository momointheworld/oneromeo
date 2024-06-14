'use server'
import * as auth from '@/auth'
import { cache } from 'react'

export const signIn = cache(async () => {
    return auth.signIn('github')
})
