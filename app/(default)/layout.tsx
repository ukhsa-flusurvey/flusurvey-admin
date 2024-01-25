import '@/styles/globals.css'
import { Open_Sans } from 'next/font/google'
import { Providers } from './providers';


const open_sans = Open_Sans({
    subsets: ['latin'],
    variable: '--font-open-sans',
})


export const metadata = {
    title: {
        default: process.env.NEXT_PUBLIC_APP_NAME || 'Case Admin',
        template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'Case Admin'} `,
    },
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
                <Providers>
                    {children}

                </Providers>
            </body>
        </html>
    );
}
