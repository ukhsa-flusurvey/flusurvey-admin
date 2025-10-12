import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getManagementUser } from '@/lib/data/userManagementAPI';
import { HelpCircle, UserRound } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';

interface UserDetailsProps {
    userId: string;
}



const UserDetails: React.FC<UserDetailsProps> = async (props) => {
    const resp = await getManagementUser(props.userId);
    const error = resp.error;

    if (error || !resp.user) {
        redirect('/tools/user-management/management-users');
    }

    const user = {
        ...resp.user,
        createdAt: resp.user.createdAt ? new Date(resp.user.createdAt) : undefined,
        lastLoginAt: resp.user.lastLoginAt ? new Date(resp.user.lastLoginAt) : undefined,
    };

    return (
        <TooltipProvider>
            <div className='max-w-full flex'>
                <Card
                    variant={"opaque"}
                >
                    <CardHeader>
                        <h2 className='text-lg font-bold'>User Details</h2>
                    </CardHeader>

                    <CardContent className='space-y-6'>
                        <Separator />
                        <div className='flex gap-4'>
                            <Avatar className='size-12'>
                                <AvatarImage src={user.imageUrl || ""} />
                                <AvatarFallback className="bg-slate-400">
                                    <UserRound className='text-white size-8' />
                                </AvatarFallback>
                            </Avatar>
                            <div className='grow space-y-1'>
                                <div className='font-bold flex items-center gap-4 text-lg'>
                                    {user.username}
                                    {user.isAdmin ? <Badge>
                                        Admin
                                    </Badge> : null}
                                    {user.provider ? <Badge variant={"outline"}>{user.provider}</Badge> : null}
                                </div>
                                <p className=''>
                                    {user.email}
                                </p>
                            </div>

                        </div>

                        <div className='flex gap-6 justify-between'>
                            <div>
                                <p className='text-xs'>
                                    Created at:
                                </p>
                                <p className='text-neutral-700 font-semibold border border-black/20 p-1 px-2 mt-1 text-sm rounded-md'>
                                    {user.createdAt?.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className='text-xs'>
                                    Last login at:
                                </p>
                                <p className='text-neutral-700 font-semibold border border-black/20 p-1 px-2 mt-1 text-sm rounded-md'>
                                    {user.lastLoginAt?.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <div className='text-xs font-bold flex items-center gap-2'>
                                sub from IdP:
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger>
                                        <HelpCircle className='size-4 text-neutral-500' />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            The sub (subject) claim is a unique identifier received from the identity provider.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <p className='text-neutral-700 font-mono border border-black/20 p-1 px-2 mt-1 text-sm rounded-md'>
                                {user.sub}
                            </p>
                        </div>

                        <div>
                            <div className='text-xs font-bold flex items-center gap-2'>
                                User ID:
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger>
                                        <HelpCircle className='size-4 text-neutral-500' />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            The unique identifier for this user in the application.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <p className='text-neutral-700 font-mono border border-black/20 p-1 px-2 mt-1 text-sm rounded-md'>
                                {user.id}
                            </p>
                        </div>
                    </CardContent>

                </Card>
            </div>
        </TooltipProvider>
    );
};

export default UserDetails;


export const UserDetailsSkeleton: React.FC = () => {
    return (
        <div className='max-w-full flex'>
            <Card
                variant={"opaque"}
            >
                <CardHeader>
                    <h2 className='text-lg font-bold'>User Details</h2>
                </CardHeader>

                <CardContent className='space-y-6'>
                    <Separator />
                    <div className='flex gap-4'>
                        <Skeleton className='size-12 rounded-full' />
                        <div className='grow space-y-2'>
                            <Skeleton className='h-6 w-72' />

                            <Skeleton className='h-5 w-64' />
                        </div>

                    </div>

                    <div className='flex gap-6'>
                        <div>
                            <p className='text-xs font-bold mb-1 text-neutral-400'>
                                Created at:
                            </p>
                            <Skeleton className='h-5 w-44' />
                        </div>
                        <div>
                            <p className='text-xs font-bold mb-1 text-neutral-400'>
                                Last login at:
                            </p>
                            <Skeleton className='h-5 w-44' />
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <Skeleton className='h-4 w-20 mb-1' />
                        <Skeleton className='h-5 w-80' />
                    </div>

                    <div>
                        <Skeleton className='h-4 w-20 mb-1' />
                        <Skeleton className='h-5 w-80 ' />
                    </div>
                </CardContent>

            </Card>
        </div>
    );
}
