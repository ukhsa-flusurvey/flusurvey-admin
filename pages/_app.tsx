import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import DefaultHead from '@/components/DefaultHead';

import { Open_Sans } from 'next/font/google'

const open_sans = Open_Sans({
    subsets: ['latin'],
    variable: '--font-open-sans',
})


export default function App({ Component, pageProps: {
    session,
    ...pageProps
} }: AppProps) {
    return <SessionProvider
        session={session}>
        <DefaultHead
            title={'Infectieradar Admin'}
            description='Admin Tool for the Infectieradar platform'
        />
        <main className={`${open_sans.variable} font-sans`}>
            <Component {...pageProps} />
        </main>
    </SessionProvider>
}
