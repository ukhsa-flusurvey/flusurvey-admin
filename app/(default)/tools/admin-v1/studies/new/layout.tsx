import React from "react"
import Container from "@/components/Container"
import Navbar from "@/components/admin-tool-v1/Navbar"

export default function Layout({ children }: { children: React.ReactNode }) {
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
                    title: 'New',
                    href: '/tools/admin-v1/studies/new'
                }
                ]}
            />
            <Container className="py-8">
                {children}
            </Container>
        </div>
    )
}
