import React from "react"
import Container from "@/components/Container"


export default function Layout({ children, params: { studyKey } }: {
    children: React.ReactNode
    params: {
        studyKey: string
    }
}) {
    return (
        <div className="h-full bg-slate-100">
            <Container className="py-8">
                {children}
            </Container>
        </div>
    )
}
