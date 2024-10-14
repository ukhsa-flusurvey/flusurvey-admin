'use client';

import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

interface NavItemDef {
    title: string;
    href: string;
}

interface NavGroupDef {
    title: string;
    items: Array<
        NavGroupDef | NavItemDef
    >
}

function isNavGroupDef(item: NavGroupDef | NavItemDef): item is NavGroupDef {
    return (item as NavGroupDef).items !== undefined;
}

interface NavItemProps {
    title: string;
    href: string;
}

const NavItem = (props: NavItemProps) => {
    const pathname = usePathname();

    const isActive = pathname === props.href;

    return (
        <Button
            variant={'ghost'}
            className={cn('font-normal px-4 -mx-4 py-1 h-fit hover:bg-primary/10 w-full justify-start rounded-l-none',
                {
                    'text-primary border-l-2 border-primary ': isActive
                }
            )}
            asChild
        >
            <Link
                href={props.href}
                prefetch={false}
            >
                {props.title}
            </Link>
        </Button>
    )
}

interface NavGroupProps {
    title: string;
    items: Array<
        NavGroupDef | NavItemDef
    >
    level: number;
}


const NavGroup = (props: NavGroupProps) => {
    const [isOpen, setIsOpen] = React.useState(true);

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className={cn(
                {
                    'pt-4': props.level === 0,
                }
            )}
        >
            {props.level === 1 && <div className='-ml-4'>
                <Separator />
            </div>}
            {props.level > 0 && <CollapsibleTrigger asChild>
                <Button
                    variant={'ghost'}
                    className='w-full justify-between items-center font-semibold pl-0'
                >
                    {props.title}
                    <span>
                        <ChevronDown className={cn(
                            'size-4 transition-transform text-muted-foreground',
                            {
                                'rotate-90': !isOpen
                            }
                        )} />
                    </span>
                </Button>
            </CollapsibleTrigger>}

            <CollapsibleContent>
                <ul className={cn(
                    'space-y-1 pl-4  mb-2',
                    {
                        'border-l border-border': props.level > 0,
                    }
                )}>
                    {props.items.map((item) => {
                        if (isNavGroupDef(item)) {
                            const group = item as NavGroupDef;
                            return <li className={cn(
                                {
                                    'pt-2': props.level === 0,
                                    // 'border-t border-border': props.rootLevel
                                }
                            )}>
                                <NavGroup title={group.title} items={group.items} level={props.level + 1} />
                            </li>
                        }
                        const linkItem = item as NavItemDef;
                        return <li className=''>
                            <NavItem title={linkItem.title} href={linkItem.href} />
                        </li>
                    })}
                </ul>
            </CollapsibleContent>
        </Collapsible >
    )
}

export default NavGroup;
