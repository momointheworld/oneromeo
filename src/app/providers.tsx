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



// components/Providers.tsx
'use client';
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from 'next-auth/react';
import AuthWrapper from '@/components/common/auth-wrapper';
import React from 'react';

interface ProviderProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProviderProps) => {
  return (
    <SessionProvider>
      <NextUIProvider>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </NextUIProvider>
    </SessionProvider>
  );
};

export default Providers;
