'use client'

import React, { useEffect, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { logout } from '@/actions/auth/logout';
import { User } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOutIcon, UserRound } from 'lucide-react';


interface UserButtonProps {
    user?: User;
    expires?: number;
}

const UserButton: React.FC<UserButtonProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();
    const [remainingTime, setRemainingTime] = useState<string | null>(null);

    useEffect(() => {
        if (props.expires !== null) {
            const expirationTime = props.expires;
            const interval = setInterval(async () => {
                if (!expirationTime) return;

                const now = (new Date()).getTime() / 1000;
                const timeDifference = expirationTime - now;
                if (timeDifference > 0) {
                    const hours = Math.floor((timeDifference % (60 * 60 * 24)) / (60 * 60));
                    const minutes = Math.floor((timeDifference % (60 * 60)) / 60);
                    const seconds = Math.floor((timeDifference % 60));
                    setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
                } else {
                    setRemainingTime('Session expired');
                    await logout();
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [props.expires]);

    if (!props.user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger >
                <div className='flex gap-2 items-center'>
                    <Avatar className='size-8'>
                        <AvatarImage src={props.user?.image || ""} />
                        <AvatarFallback className="bg-slate-500">
                            <UserRound className='text-white size-6' />
                        </AvatarFallback>
                    </Avatar>
                    <div className='hidden sm:block'>
                        <p className='max-w-[156px] truncate text-start text-sm'>
                            {props.user?.name}
                        </p>
                        <p className='text-start text-xs text-neutral-500'>
                            {remainingTime}
                        </p>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>
                    <p className='text-neutral-500 text-sm mb-2'>
                        {props.user?.email}
                    </p>
                    <p className='text-end text-xs text-neutral-500' >
                        Session expires in:
                    </p>
                    <p className='text-end text-xs '>
                        {remainingTime}
                    </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className='text-red-800'
                    disabled={isPending}
                    onClick={() => {
                        startTransition(async () => {
                            await logout();
                        })
                    }}
                >
                    Logout
                    <LogOutIcon className='size-4 ml-2' />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserButton;
