import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidenav from "@/components/admin-tool-v1/Sidenav";
import { ArrowLeftIcon, BarsArrowDownIcon, BoltIcon, ClipboardDocumentListIcon, DocumentTextIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react"

// export const revalidate = 0;
export const dynamic = 'force-dynamic'



export default async function Layout({ children, params: { studyKey } }: {
    children: React.ReactNode
    params: { studyKey: string }
}) {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.user === undefined) {
        redirect('/auth/login?callbackUrl=/tools/admin-v1');
    }

    const links = [
        {
            title: 'Back',
            href: '/tools/admin-v1',
            icon: <ArrowLeftIcon className="w-6 h-6" />
        },
        {
            title: 'Participants',
            href: `/tools/admin-v1/studies/${studyKey}/participants`,
            icon: <UserGroupIcon className="w-6 h-6" />
        },
        {
            title: 'Surveys',
            href: `/tools/admin-v1/studies/${studyKey}`,
            icon: <DocumentTextIcon className="w-6 h-6" />
        },
        {
            title: 'Study Rules',
            href: `/tools/admin-v1/studies/${studyKey}/rules`,
            icon: <BarsArrowDownIcon className="w-6 h-6" />
        },
        {
            title: 'Study actions',
            href: `/tools/admin-v1/studies/${studyKey}/actions`,
            icon: <BoltIcon className="w-6 h-6" />
        },
    ];


    return (
        <div className="h-full flex w-full">
            <Sidenav
                title={{
                    label: `Study: ${studyKey}`,
                    icon: <span className="bg-sky-600/50 rounded text-white w-8 h-8 flex text-lg items-center justify-center">
                        <ClipboardDocumentListIcon className="w-5 h-5" />
                    </span>
                }}
                links={links}
            />
            <div className="overflow-y-scroll grow">
                {children}
            </div>
        </div >
    )
}
