'use client'

import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { logout } from '@/actions/auth/logout';
import { User } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOutIcon, UserRound } from 'lucide-react';


interface UserButtonProps {
    user?: User;
}

const UserButton: React.FC<UserButtonProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();

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
                    <span className='max-w-[156px] truncate hidden sm:block'>
                        {props.user?.name}
                    </span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
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
