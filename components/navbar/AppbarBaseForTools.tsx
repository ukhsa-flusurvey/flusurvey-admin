import { Button, Tooltip } from '@nextui-org/react';
import React from 'react';
import NextUILink from 'next/link';
import { BsXLg } from 'react-icons/bs';
import clsx from 'clsx';
import NavbarAuth from './NavbarAuth';

interface AppbarBaseForToolsProps {
    toolName: string;
    toolIcon?: React.ReactNode;
    children?: React.ReactNode;
    isBordered?: boolean;
}

const AppbarBaseForTools: React.FC<AppbarBaseForToolsProps> = (props) => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';

    return (
        <div className={clsx(
            'bg-content2 z-40',
            {
                'border-b border-b-default': props.isBordered,
                'py-unit-sm': props.children === undefined,
                'pt-unit-sm': props.children !== undefined
            }
        )}>
            <div className="flex items-center px-unit-lg flex-wrap">
                <div
                    className="flex flex-col items-start justify-center border-l-2 border-cyan-800 ps-unit-2"
                >
                    <p className='font-normal text-cyan-800 text-tiny'>CASE ADMIN</p>
                    <p className='font-semibold tracking-wider text-small'>{appName}</p>
                </div>

                <div className='flex grow gap-unit-sm justify-center items-center'>
                    {props.toolIcon}
                    <h1 className="text-center font-bold text-xl">
                        {props.toolName}
                    </h1>
                </div>



                <div className="flex gap-2 items-center">
                    <NavbarAuth />
                    <Tooltip showArrow={true} content="Return to main menu">
                        <Button
                            as={NextUILink}
                            color='secondary'
                            href='/'
                            variant='light'
                            className='text-2xl'
                            isIconOnly
                            aria-label='Exit'
                        >
                            <BsXLg />
                        </Button>
                    </Tooltip>
                </div>
            </div>
            {props.children}
        </div>
    );
};

export default AppbarBaseForTools;
