'use client'
import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import AuthWrapper from '@/components/common/auth-wrapper'
import React from 'react'
import { TimezoneProvider } from '@/hooks/useTimezone'
import { DateProvider } from '@/hooks/useDate'
import { EmailProvider } from '@/hooks/useEmail'
import { SelectedItemProvider } from '@/hooks/useSelectedItem'
import { CookieConsentProvider } from '@/hooks/useCookieConsent'
import { GoogleAnalyticsProvider } from '@/components/googleAnalyticsProvider'
import CookieConsent from '@/components/cookieConsent'

interface ProviderProps {
    children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
    return (
        <SessionProvider>
            <NextUIProvider>
                <CookieConsentProvider>
                    <AuthWrapper>
                        <SelectedItemProvider>
                            <TimezoneProvider>
                                <DateProvider>
                                    <EmailProvider>
                                        {children}
                                        <GoogleAnalyticsProvider />
                                        <CookieConsent />
                                    </EmailProvider>
                                </DateProvider>
                            </TimezoneProvider>
                        </SelectedItemProvider>
                    </AuthWrapper>
                </CookieConsentProvider>
            </NextUIProvider>
        </SessionProvider>
    )
}

export default Providers
