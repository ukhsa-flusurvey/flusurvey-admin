import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidenav from "@/components/admin-tool-v1/Sidenav";
import { ArrowLeftIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react"

// export const revalidate = 0;
export const dynamic = 'force-dynamic'

const links = [
    {
        title: 'Back',
        href: '/tools/admin-v1',
        icon: <ArrowLeftIcon className="w-6 h-6" />
    },
    {
        title: 'Dashboard',
        href: '/tools/admin-v1',
        icon: <ClipboardDocumentListIcon className="w-6 h-6" />
    }
];

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.user === undefined) {
        redirect('/auth/login?callbackUrl=/tools/admin-v1');
    }


    return (
        <div className="h-full flex w-full">
            <Sidenav
                links={links}
            />

            {children}
        </div >
    )
}
