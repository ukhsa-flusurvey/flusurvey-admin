'use client';

import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';

export interface NavItemDef {
    title: string;
    href: string;
}

export interface NavGroupDef {
    title: string;
    items: Array<
        NavGroupDef | NavItemDef
    >
    defaultOpen?: boolean;
}

function isNavGroupDef(item: NavGroupDef | NavItemDef): item is NavGroupDef {
    return (item as NavGroupDef).items !== undefined;
}

interface NavItemProps {
    title: string;
    href: string;
}

export const NavItem = (props: NavItemProps) => {
    const pathname = usePathname();

    const isActive = pathname === props.href;

    return (
        <SidebarMenuButton asChild
            isActive={isActive}
            className="h-fit data-[active=true]:underline data-[active=true]:font-normal"
        >

            <Link
                href={props.href}
                prefetch={false}
            >
                {props.title}
            </Link>
        </SidebarMenuButton>
    )
}

interface NavGroupProps {
    title: string;
    items: Array<
        NavGroupDef | NavItemDef
    >
}


const NavGroup = (props: NavGroupProps) => {

    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                        {props.title}
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {props.items.map((item, index) => (
                                <Tree key={index} item={item} />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>

                </CollapsibleContent>
            </SidebarGroup>
        </Collapsible>
    )
}

export default NavGroup;


function Tree({ item }: { item: NavItemDef | NavGroupDef }) {
    const items = isNavGroupDef(item) ? item.items : [];

    if (!isNavGroupDef(item)) {
        const linkItem = item as NavItemDef;
        return (
            <NavItem
                title={linkItem.title}
                href={linkItem.href}
            />
        )
    }

    return (
        <SidebarMenuItem>
            <Collapsible
                className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                defaultOpen={item.defaultOpen}
            >
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <ChevronRight className="transition-transform" />
                        <span className='font-semibold'>
                            {item.title}
                        </span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {items.map((subItem, index) => (
                            <Tree key={index} item={subItem} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
}
