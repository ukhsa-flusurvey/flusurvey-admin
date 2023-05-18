'use client';

import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, DocumentIcon } from '@heroicons/react/24/solid';
import { Transition } from '@headlessui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


interface NavbarProps {
    links: { href: string; title: string, icon: ReactNode }[];
}

const ToggleButton: React.FC<{ isExpanded: boolean, onClick: () => void }> = (props) => {
    return (
        <button onClick={props.onClick}
            className={clsx(
                'flex items-center gap-2 flex-nowrap',
                'py-4',
                'w-full text-left',
                'transition-colors duration-200 hover:bg-gray-100',
                'overflow-hidden'
            )}
        >
            {props.isExpanded ? <span className='ps-4'>
                <ChevronDoubleLeftIcon className="w-6 h-6" />
            </span> : <>
                <ChevronDoubleRightIcon className="w-6 h-6 mx-auto" />
            </>}
            <Transition show={props.isExpanded}
                enter="transition-all duration-200"
                enterFrom="opacity-0 w-0"
                enterTo="opacity-100 w-auto"
                className={'whitespace-nowrap'}
            >
                Collapse menu
            </Transition>
        </button>
    );
}

const Navbar: React.FC<NavbarProps> = (props) => {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const pathname = usePathname();

    const isActiveRoute = (href: string) => {
        return pathname.startsWith(href);
    }


    return (
        <div className={clsx(
            "bg-[url(/images/colorful-circles-portrait.png)] bg-cover bg-center",
            "border-r border-gray-200",
            "transition-all duration-200",
            isExpanded ? 'w-64 min-w-[255px]' : 'w-16'
        )}>
            <div className="backdrop-blur-3xl bg-white/95 h-full flex flex-col justify-center">

                <h2 className="flex items-center p-4 gap-2">
                    <span className="bg-red-400 rounded text-white w-8 h-8 flex text-lg items-center justify-center">
                        A
                    </span>
                    {isExpanded &&
                        <span className="text-xl font-bold">
                            Admin Tool V1
                        </span>}
                </h2>
                <div className='px-4'>
                    <hr></hr>
                </div>
                <nav className='flex flex-col gap-2 p-2'>
                    {props.links.map(link => {
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx('flex items-center gap-2 flex-nowrap hover:bg-gray-100 rounded py-2 px-2',
                                    'group relative overflow-visible',
                                    {
                                        'justify-center': !isExpanded,
                                        'bg-gray-100 hover:bg-gray-200': isActiveRoute(link.href),
                                    }
                                )}
                            >
                                <span
                                    className={clsx(
                                        {
                                            'text-gray-600': !isExpanded,
                                            'text-gray-400': isExpanded,
                                        }
                                    )}
                                >{link.icon}</span>
                                {isExpanded && link.title}
                                {!isExpanded && <div className={clsx(
                                    'absolute left-[52px] group-hover:opacity-100 opacity-0 -translate-x-1/2 group-hover:translate-x-0 h-full flex items-center flex-nowrap transition-all bg-gray-100 shadow-sm p-2 rounded whitespace-nowrap',
                                    {
                                        'bg-gray-200': isActiveRoute(link.href),
                                    }
                                )}>
                                    {link.title}
                                </div>}
                            </Link>)
                    })}
                </nav>
                <span className='grow'></span>
                <ToggleButton isExpanded={isExpanded} onClick={() => setIsExpanded(prev => !prev)} />
            </div>
        </div>

    );
};

export default Navbar;
