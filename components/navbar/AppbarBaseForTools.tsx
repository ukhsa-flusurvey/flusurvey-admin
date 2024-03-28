import React from 'react';
import { BsXLg } from 'react-icons/bs';
import clsx from 'clsx';
import NavbarAuth from './NavbarAuth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import Link from 'next/link';

interface AppbarBaseForToolsProps {
    toolName: string;
    toolIcon?: React.ReactNode;
    children?: React.ReactNode;
    isBordered?: boolean;
}

const AppbarBaseForTools: React.FC<AppbarBaseForToolsProps> = (props) => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';

    return (
        <TooltipProvider>
            <nav className={clsx(
                'z-40',
                {
                    'border-b border-b-neutral-300': props.isBordered,
                    'py-2': props.children === undefined,
                    'pt-3': props.children !== undefined
                }
            )}>
                <div className="flex items-center px-6 flex-wrap">
                    <div
                        className="flex flex-col items-start justify-center border-l-2 border-cyan-800 ps-3"
                    >
                        <p className='font-normal text-cyan-800 text-xs'>CASE ADMIN</p>
                        <p className='font-semibold tracking-wider text-sm'>{appName}</p>
                    </div>

                    <div className='flex grow gap-3 justify-center items-center'>
                        {props.toolIcon}
                        <h1 className="text-center font-bold text-xl">
                            {props.toolName}
                        </h1>
                    </div>

                    <div className="flex gap-2 items-center">
                        <NavbarAuth />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    asChild
                                    variant='ghost'
                                    className='text-2xl'
                                    size={'icon'}
                                    aria-label='Exit'
                                >
                                    <Link
                                        href="/"
                                    >
                                        <BsXLg />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Return to main menu
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
                {props.children}
            </nav>
        </TooltipProvider>
    );
};

export default AppbarBaseForTools;
