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
import { TimezoneProvider } from '@/components/useTimezone'

interface ProviderProps {
    children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => {
    return (
        <SessionProvider>
            <NextUIProvider>
                <AuthWrapper>
                    <TimezoneProvider>{children}</TimezoneProvider>
                </AuthWrapper>
            </NextUIProvider>
        </SessionProvider>
    )
}

export default Providers
