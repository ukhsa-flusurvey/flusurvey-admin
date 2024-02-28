'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import Link from "next/link";
import { Sidebar, SidebarItem } from "@/components/Sidebar";
import { BsEnvelopeExclamation, BsEnvelopePlus, BsExclamationCircle, BsHouse, BsInputCursor, BsPersonCheck, BsPersonPlus, BsShieldCheck, BsShieldExclamation, BsTrash3 } from "react-icons/bs";
import { Recycle } from 'lucide-react';


interface SystemMessagesSidebarProps {
}

const SystemMessagesSidebar: React.FC<SystemMessagesSidebarProps> = (props) => {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarItem
                tooltip="Back to main menu"
                className='border-b border-default-300'
                href='/tools/messaging'
                as={Link}
            >
                <BsHouse />
            </SidebarItem>

            <SidebarItem
                tooltip="Registration"
                //className="bg-emerald-500"
                isActive={pathname === '/tools/messaging/system-messages/registration'}
                href='/tools/messaging/system-messages/registration'
                as={Link}
            >
                <BsPersonPlus />
            </SidebarItem>

            <SidebarItem
                tooltip="Verify Email"
                isActive={pathname === '/tools/messaging/system-messages/verify-email'}
                href='/tools/messaging/system-messages/verify-email'
                as={Link}
            >
                <BsPersonCheck />
            </SidebarItem>

            <SidebarItem
                tooltip="Verification Code"
                isActive={pathname === '/tools/messaging/system-messages/verification-code'}
                href='/tools/messaging/system-messages/verification-code'
                as={Link}
            >
                <BsShieldCheck />
            </SidebarItem>

            <SidebarItem
                tooltip="Initiate password reset"
                isActive={pathname === '/tools/messaging/system-messages/password-reset'}
                href='/tools/messaging/system-messages/password-reset'
                as={Link}
            >
                <BsInputCursor />
            </SidebarItem>

            <SidebarItem
                tooltip="Password changed"
                isActive={pathname === '/tools/messaging/system-messages/password-changed'}
                href='/tools/messaging/system-messages/password-changed'
                as={Link}
            >
                <BsShieldExclamation />
            </SidebarItem>
            <SidebarItem
                tooltip="Account ID changed"
                isActive={pathname === '/tools/messaging/system-messages/account-id-changed'}
                href='/tools/messaging/system-messages/account-id-changed'
                as={Link}
            >
                <BsEnvelopeExclamation />
            </SidebarItem>

            <SidebarItem
                tooltip="Inactivity notice"
                isActive={pathname === '/tools/messaging/system-messages/account-inactivity'}
                href='/tools/messaging/system-messages/account-inactivity'
                as={Link}
            >
                <BsExclamationCircle />
            </SidebarItem>

            <SidebarItem
                tooltip="Account deleted after inactivity"
                isActive={pathname === '/tools/messaging/system-messages/account-deleted-after-inactivity'}
                href='/tools/messaging/system-messages/account-deleted-after-inactivity'
                as={Link}
            >
                <Recycle />
            </SidebarItem>


            <SidebarItem
                tooltip="Account deleted"
                isActive={pathname === '/tools/messaging/system-messages/account-deleted'}
                href='/tools/messaging/system-messages/account-deleted'
                as={Link}
            >
                <BsTrash3 />
            </SidebarItem>

            <SidebarItem
                tooltip="Invitation"
                isActive={pathname === '/tools/messaging/system-messages/invitation'}
                href='/tools/messaging/system-messages/invitation'
                as={Link}
            >
                <BsEnvelopePlus />
            </SidebarItem>
        </Sidebar>
    );
};

export default SystemMessagesSidebar;
