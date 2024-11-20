'use client'
import { createContext, useContext, useState, useEffect } from 'react'

type CookieConsentState = 'accepted' | 'declined' | undefined
type CookieConsentValue = 'accepted' | 'declined'

interface CookieConsentContextType {
    cookieConsent: CookieConsentState
    updateCookieConsent: (state: CookieConsentValue) => void
}

const CookieConsentContext = createContext<CookieConsentContextType>({
    cookieConsent: undefined,
    updateCookieConsent: () => {},
})

export const useCookieConsent = () => useContext(CookieConsentContext)

export function CookieConsentProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [cookieConsent, setCookieConsent] =
        useState<CookieConsentState>(undefined)

    useEffect(() => {
        // Run this effect only on client side
        const savedConsent = localStorage.getItem(
            'cookieConsent'
        ) as CookieConsentValue | null
        setCookieConsent(savedConsent || undefined)
    }, [])

    const updateCookieConsent = (state: CookieConsentValue) => {
        localStorage.setItem('cookieConsent', state)
        setCookieConsent(state)
    }

    return (
        <CookieConsentContext.Provider
            value={{ cookieConsent, updateCookieConsent }}
        >
            {children}
        </CookieConsentContext.Provider>
    )
}
