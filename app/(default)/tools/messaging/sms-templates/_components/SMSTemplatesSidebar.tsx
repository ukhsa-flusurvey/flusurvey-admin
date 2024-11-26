'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarLinkItem } from "@/components/Sidebar";
import { BadgeCheck, Home, ShieldEllipsis } from 'lucide-react';



const sideBarLinkItems = [
    {
        href: '/tools/messaging/sms-templates/verify-phone-number',
        tooltip: 'Phone number verification',
        icon: <BadgeCheck />
    },
    {
        href: '/tools/messaging/sms-templates/otp',
        tooltip: 'One-time passwords (MFA)',
        icon: <ShieldEllipsis />
    },
]


const SMSTemplatesSidebar: React.FC = () => {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarLinkItem
                tooltip="Back to main menu"
                className='border-b border-black/20'
                href='/tools/messaging'
            >
                <Home />
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

export default SMSTemplatesSidebar;


