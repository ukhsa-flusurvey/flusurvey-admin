import React from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
    // if not logged in - forward to login page with callback url


    return (
        <div className="h-full bg-slate-100">
            {children}
        </div>
    )
}
