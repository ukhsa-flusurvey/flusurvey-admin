'use client'

import AuthProvider from '@/components/AuthProvider'
import { NextUIProvider } from '@nextui-org/react'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <NextUIProvider>
                {children}
            </NextUIProvider>
        </AuthProvider>
    )
}