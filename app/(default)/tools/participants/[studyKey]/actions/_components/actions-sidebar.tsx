'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface ActionsSidebarProps {
    studyKey: string;
}


const ActionsSidebar: React.FC<ActionsSidebarProps> = (props) => {
    const pathname = usePathname();

    const actionTypes = [
        {
            label: 'General custom action',
            href: `/tools/participants/${props.studyKey}/actions/general`,
        },
        {
            label: 'On previous responses',
            href: `/tools/participants/${props.studyKey}/actions/on-responses`,
        },
    ];


    return (
        <aside className="w-64 border-r border-border">
            <ScrollArea className="h-full">
                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Action Types</h2>
                    <div className="space-y-2">

                        {actionTypes.map((action) => (
                            <Button
                                asChild
                                key={action.href}
                                variant={pathname.startsWith(action.href) ? 'default' : 'ghost'}
                                className="w-full justify-start"
                            >
                                <Link href={action.href}>
                                    {action.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
};

export default ActionsSidebar;
