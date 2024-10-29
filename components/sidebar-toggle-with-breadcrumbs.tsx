'use client'
import React from 'react';
import { useSidebar } from './ui/sidebar';
import { Separator } from './ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { HomeIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

interface SidebarToggleWithBreadcrumbsProps {
    breadcrumbs?: Array<{
        content: string | React.ReactNode;
        href?: string;
    }>;
}

const SidebarToggleWithBreadcrumbs: React.FC<SidebarToggleWithBreadcrumbsProps> = (props) => {
    const { toggleSidebar, open } = useSidebar()

    return (
        <div className="flex items-center gap-2 px-2 py-2">

            <Button
                variant='ghost'
                size='icon'
                className='text-neutral-500 hover:text-neutral-600'
                onClick={toggleSidebar}
            >
                {open ? <PanelLeftCloseIcon className='size-5' /> : <PanelLeftOpenIcon className='size-5' />}
            </Button>

            <Separator
                orientation="vertical"
                className="h-5"
            />
            <Breadcrumb className='pl-2'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">
                            <HomeIcon className='size-4' />
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    {props.breadcrumbs?.map((breadcrumb, index) => (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem key={index}>
                                {!breadcrumb.href ? <BreadcrumbPage>
                                    {breadcrumb.content}
                                </BreadcrumbPage> :
                                    <BreadcrumbLink asChild>
                                        <Link href={breadcrumb.href}>
                                            {breadcrumb.content}
                                        </Link>
                                    </BreadcrumbLink>}
                            </BreadcrumbItem>
                        </>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};

export default SidebarToggleWithBreadcrumbs;
