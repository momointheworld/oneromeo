'use server'

import { cookies } from 'next/headers'

export async function setCookie(name: string, value: string) {
    const cookieStore = cookies()

    cookieStore.set(name, value, { httpOnly: true, secure: true })
}

export async function setDownloadToken(token: string) {
    const cookieStore = cookies()
    cookieStore.set('downloadToken', token, {
        httpOnly: false, // Allows client-side access
        secure: false, // Set to true in production
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60, // 1 hour
    })
    console.log('Download token set:', token)
}
