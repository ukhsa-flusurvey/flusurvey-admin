import React from "react"


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen bg-content1 bg-center bg-cover bg-[url(/images/network_gi.png)]">
            <div className="w-screen h-screen bg-white/30 backdrop-blur-sm">
                {children}
            </div>
        </div>
    )
}
