import React from "react"
import Container from "@/components/Container"
import Navbar from "@/components/admin-tool-v1/Navbar"

export default function Layout({ children, params: { studyKey } }: {
    children: React.ReactNode
    params: {
        studyKey: string
    }
}) {
    return (
        <div className="h-full bg-slate-100">
            <Navbar
                links={[{
                    title: 'Home',
                    href: '/tools/admin-v1'
                },
                {
                    title: 'Studies',
                },
                {
                    title: studyKey,
                    href: '/tools/admin-v1/studies/' + studyKey
                }
                ]}
            />
            <Container className="py-8">
                {children}
            </Container>
        </div>
    )
}
