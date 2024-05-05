'use client';
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from 'next-auth/react';

interface ProviderPros {
    children: React.ReactNode
}

export default function Providers({children}: ProviderPros) {
    return (
        <SessionProvider>
            <NextUIProvider>
                {children}
            </NextUIProvider>
        </SessionProvider>
    )
}