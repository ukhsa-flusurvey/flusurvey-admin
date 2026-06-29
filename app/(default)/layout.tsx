import '@/styles/globals.css'
import '@fontsource/open-sans/latin-300.css'
import '@fontsource/open-sans/latin-300-italic.css'
import '@fontsource/open-sans/latin-400.css'
import '@fontsource/open-sans/latin-400-italic.css'
import '@fontsource/open-sans/latin-500.css'
import '@fontsource/open-sans/latin-500-italic.css'
import '@fontsource/open-sans/latin-600.css'
import '@fontsource/open-sans/latin-600-italic.css'
import '@fontsource/open-sans/latin-700.css'
import '@fontsource/open-sans/latin-700-italic.css'
import '@fontsource/open-sans/latin-800.css'
import '@fontsource/open-sans/latin-800-italic.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Metadata } from 'next'


export const metadata: Metadata = {
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
        <html lang="en" className="font-sans">
            <body>
                <TooltipProvider>
                    {children}
                </TooltipProvider>
            </body>
        </html>
    );
}
