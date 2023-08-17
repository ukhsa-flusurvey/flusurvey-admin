import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidenav from "@/components/admin-tool-v1/Sidenav";
import { ArrowLeftIcon, ChatBubbleBottomCenterTextIcon, ClipboardDocumentListIcon, ClockIcon, EnvelopeIcon, HomeIcon, InboxStackIcon } from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react"
import MessagingAppbarBase from "./MessagingAppbarBase";

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
        href: '/tools/admin-v1/messaging',
        icon: <HomeIcon className="w-6 h-6" />
    },
    {
        title: 'System messages',
        href: '/tools/admin-v1/messaging/common-templates',
        icon: <InboxStackIcon className="w-6 h-6" />
    },
    {
        title: 'Custom messages',
        href: '/tools/admin-v1/messaging/custom-templates',
        icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
    },
    {
        title: 'Schedules',
        href: '/tools/admin-v1/messaging/schedules',
        icon: <ClockIcon className="w-6 h-6" />
    }
];

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session || session.error || session.user === undefined) {
        redirect('/auth/login?callbackUrl=/tools/admin-v1/messaging');
    }


    return (
        <>
            <MessagingAppbarBase />
            <div className="h-full flex w-full">

                <Sidenav
                    title={{
                        label: 'Messaging',
                        icon: <span className="bg-sky-600/50 rounded text-white w-8 h-8 flex text-lg items-center justify-center">
                            <EnvelopeIcon className="w-5 h-5" />
                        </span>
                    }}
                    links={links}
                />
                <div className="overflow-y-scroll grow">
                    {children}
                </div>
            </div >
        </>
    )
}
