// components/AuthWrapper.tsx
'use client';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, ReactNode } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session && pathName.startsWith('/dashboard')) {
      router.push('/login'); // Redirect if not authenticated
    }
  }, [session, status, pathName, router]);

  if (!session && pathName.startsWith('/dashboard')) {
    return null; // Optionally render nothing while redirecting
  }

  return <>{children}</>;
};

export default AuthWrapper;
