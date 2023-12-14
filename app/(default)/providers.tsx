'use client'

import AuthProvider from '@/components/AuthProvider'
import { NextUIProvider } from '@nextui-org/react'
import { useRouter } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <AuthProvider>
            <NextUIProvider navigate={router.push}>
                {children}
            </NextUIProvider>
        </AuthProvider>
    )
}
