import React from "react"
import Container from "@/components/Container"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full bg-slate-100">
            <div className='h-52 bg-cyan-800 -mb-52'>
            </div>
            <Container>
                <div className="border-t border-white/25"></div>
            </Container>
            <Container className="my-8">
                <h2 className="text-3xl  font-semibold text-white text-center">Service Status</h2>
            </Container>
            {children}
        </div>
    )
}
