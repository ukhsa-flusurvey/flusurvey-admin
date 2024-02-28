'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { Sidebar, SidebarLinkItem } from "@/components/Sidebar";
import { BsEnvelopeExclamation, BsEnvelopePlus, BsExclamationCircle, BsHouse, BsInputCursor, BsPersonCheck, BsPersonPlus, BsShieldCheck, BsShieldExclamation, BsTrash3 } from "react-icons/bs";
import { Recycle } from 'lucide-react';


interface SystemMessagesSidebarProps {
}

const sideBarLinkItems = [
    {
        href: '/tools/messaging/email-templates/system-templates/registration',
        tooltip: 'Registration',
        icon: <BsPersonPlus />
    },
    {
        href: '/tools/messaging/email-templates/system-templates/verify-email',
        tooltip: 'Verify Email',
        icon: <BsPersonCheck />
    },
    {
        href: '/tools/messaging/email-templates/system-templates/verification-code',
        tooltip: 'Verification Code',
        icon: <BsShieldCheck />
    },
    {
        href: '/tools/messaging/email-templates/system-templates/password-reset',
        tooltip: 'Initiate password reset',
        icon: <BsInputCursor />
    },
    {
        href: '/tools/messaging/email-templates/system-templates/password-changed',
        tooltip: 'Password changed',
        icon: <BsShieldExclamation />
    },
    {
        href: '/tools/messaging/email-templates/system-templates/account-id-changed',
        tooltip: 'Account ID changed',
        icon: <BsEnvelopeExclamation />
    },
    {
        href: '/tools/messaging/email-templates/system-templates/account-inactivity',
        tooltip: 'Inactivity notice',
        icon: <BsExclamationCircle />
    },
    {
        href: '/tools/messaging/email-templates/system-templates/account-deleted-after-inactivity',
        tooltip: 'Account deleted after inactivity',
        icon: <Recycle />
    },
    {
        href: '/tools/messaging/email-templates/system-templates/account-deleted',
        tooltip: 'Account deleted',
        icon: <BsTrash3 />
    },
    {
        href: '/tools/messaging/email-templates/system-templates/invitation',
        tooltip: 'Invitation',
        icon: <BsEnvelopePlus />
    },
]

const SystemMessagesSidebar: React.FC<SystemMessagesSidebarProps> = (props) => {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarLinkItem
                tooltip="Back to main menu"
                className='border-b border-black/20'
                href='/tools/messaging'
            >
                <BsHouse />
            </SidebarLinkItem>

            {sideBarLinkItems.map((item, index) => (
                <SidebarLinkItem
                    key={index}
                    tooltip={item.tooltip}
                    isActive={pathname === item.href}
                    href={item.href}
                >
                    {item.icon}
                </SidebarLinkItem>
            ))}
        </Sidebar>
    );
};

export default SystemMessagesSidebar;
