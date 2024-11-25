import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Activity, ChevronRight, UserRound } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export interface ManagementUser {
    id: string;
    sub?: string;
    email: string;
    username: string;
    imageUrl?: string;
    isAdmin: boolean;
    lastLoginAt?: Date;
    createdAt?: Date;
}

interface ListItemProps {
    user: ManagementUser;
}

const ListItem: React.FC<ListItemProps> = (props) => {
    return (
        <li>
            <Link
                href={`/tools/user-management/management-users/${props.user.id}`}
                className='flex gap-4 rounded-sm items-center px-2 py-3 hover:bg-gray-100 transition-colors duration-200 ease-in-out cursor-pointer'
            >
                <Avatar className='size-12'>
                    <AvatarImage src={props.user.imageUrl || ""} />
                    <AvatarFallback className="bg-slate-400">
                        <UserRound className='text-white size-8' />
                    </AvatarFallback>
                </Avatar>
                <div className='grow space-y-1'>
                    <div className='font-bold flex items-center gap-4'>
                        {props.user.username}
                        {props.user.isAdmin ? <Badge>
                            Admin
                        </Badge> : null}
                    </div>
                    <div className='text-sm flex items-center grow justify-between gap-4'>
                        {props.user.email}

                        <div className='flex items-center gap-1'>
                            <Activity className='size-4 text-neutral-600' />
                            {props.user.lastLoginAt && (
                                <p className='text-xs text-neutral-500'>
                                    {props.user.lastLoginAt.toLocaleString()}
                                </p>
                            )}
                        </div>

                    </div>
                </div>
                <div>
                    <ChevronRight className='size-6 text-neutral-600' />
                </div>

            </Link>
        </li>
    );
};

export default ListItem;
