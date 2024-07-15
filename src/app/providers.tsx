// 'use client';
// import { NextUIProvider } from "@nextui-org/react";
// import { SessionProvider } from 'next-auth/react';

// interface ProviderPros {
//     children: React.ReactNode
// }

// export default function Providers({children}: ProviderPros) {
//     return (
//         <SessionProvider>
//             <NextUIProvider>
//                 {children}
//             </NextUIProvider>
//         </SessionProvider>
//     )
// }

'use client'
import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import AuthWrapper from '@/components/common/auth-wrapper'
import React from 'react'
import { TimezoneProvider } from '@/hooks/useTimezone'
import { DateProvider } from '@/hooks/useDate'
import { EmailProvider } from '@/hooks/useEmail'
import { SelectedItemProvider } from '@/hooks/useSelectedItem'

interface ProviderProps {
    children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
    return (
        <SessionProvider>
            <NextUIProvider>
                <AuthWrapper>
                    <SelectedItemProvider>
                        <TimezoneProvider>
                            <DateProvider>
                                <EmailProvider> {children} </EmailProvider>
                            </DateProvider>
                        </TimezoneProvider>
                    </SelectedItemProvider>
                </AuthWrapper>
            </NextUIProvider>
        </SessionProvider>
    )
}

export default Providers
