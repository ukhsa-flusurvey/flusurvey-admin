import AuthProvider from '@/components/AuthProvider';
import AppBar from '@/components/appbar/AppBar';
import '@/styles/globals.css'

import { Open_Sans } from 'next/font/google'


const open_sans = Open_Sans({
    subsets: ['latin'],
    variable: '--font-open-sans',
})


export const metadata = {
    title: process.env.NEXT_PUBLIC_APP_NAME || '',
    description: 'This is the CASE admin tool, to manage studies, surveys, messages and participants.'
};


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${open_sans.variable} font-sans`}>
            <body>
                <AuthProvider>
                    <AppBar />
                    <main className='h-screen pt-16'>
                        {children}
                    </main>
                </AuthProvider>
            </body>
        </html>
    );
}
