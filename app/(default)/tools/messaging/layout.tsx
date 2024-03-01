import React from "react"
import MessagingAppbarBase from "./MessagingAppbarBase";

// export const revalidate = 0;
export const dynamic = 'force-dynamic'


export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
        <div className="h-screen flex flex-col">
            <MessagingAppbarBase />
            <div className="bg-cover bg-center bg-[url(/images/foldedpaper_pattern.png)] grow">
                <div className="w-full h-full">
                    {children}
                </div>
            </div>
        </div>
    )
}
