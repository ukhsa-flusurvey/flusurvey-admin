import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidenav from "@/components/admin-tool-v1/Sidenav";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react"

// export const revalidate = 0;
export const dynamic = 'force-dynamic'

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.user === undefined) {
        redirect('/auth/login?callbackUrl=/tools/admin-v1');
    }


    return (
        <div className="h-full bg-slate-100 w-full">

            {children}
        </div >
    )
}
