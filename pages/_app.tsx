import '@/styles/globals.css'
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import DefaultHead from '@/components/DefaultHead';


export default function App({ Component, pageProps: {
    session,
    ...pageProps
} }: AppProps) {
    return <SessionProvider session={session}>
        <DefaultHead
            title={'Infectieradar Admin'}
            description='Admin Tool for the Infectieradar platform'
        />
        <Component {...pageProps} />
    </SessionProvider>
}
