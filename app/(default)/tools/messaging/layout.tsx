import React from "react"
import MessagingAppbarBase from "./MessagingAppbarBase";
import { Toaster } from "sonner";

// export const revalidate = 0;
export const dynamic = 'force-dynamic'


export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
        <div className="h-screen flex flex-col bg-cover bg-center bg-[url(/images/foldedpaper_pattern.png)]">
            <div className="shrink-0 bg-white">
                <MessagingAppbarBase />
            </div>
            <div className="grow overflow-hidden flex flex-col">
                {children}
            </div>
            <Toaster />
        </div>
    )
}
