'use client'

import * as React from "react"
import { ChevronDown } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
} from "@/components/ui/sidebar"

interface TocItem {
    title: string
    url: string
    items: TocItem[]
}

interface TocSidebarProps {
    toc: TocItem[]
}

export default function Component({ toc = [] }: TocSidebarProps) {
    return (

        <Sidebar
            className="bg-transparent"
            side="right"
            collapsible="none"

        >
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>On this page</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <TocMenu items={toc} level={1} />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

function TocMenu({ items, level }: { items: TocItem[], level: number }) {
    // Only render items up to level 3
    if (level > 3) return null

    return (
        <SidebarMenu>
            {items.map((item, index) => (
                <TocMenuItem key={index} item={item} level={level} />
            ))}
        </SidebarMenu>
    )
}

function TocMenuItem({ item, level }: { item: TocItem, level: number }) {
    const hasSubItems = item.items.length > 0 && level < 3

    return (
        <SidebarMenuItem className="">
            <SidebarMenuButton
                asChild
                className={`pl-${level * 1}  h-fit`}
            >
                <a href={item.url} className="flex items-center justify-between">
                    {item.title}
                </a>
            </SidebarMenuButton>
            {hasSubItems && (
                <SidebarMenuSub className="pr-0 mr-0">
                    <TocMenu items={item.items} level={level + 1} />
                </SidebarMenuSub>
            )}
        </SidebarMenuItem>
    )
}
