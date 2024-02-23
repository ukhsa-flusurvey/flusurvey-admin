import { auth } from '@/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fetchCASEManagementAPI } from '@/utils/server/fetch-case-management-api';
import { Circle, HelpCircle, UserRound } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';

interface UserDetailsProps {
    userId: string;
}

const getManagementUser = async (userId: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/management-users/' + userId;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch management user: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}


const UserDetails: React.FC<UserDetailsProps> = async (props) => {
    const resp = await getManagementUser(props.userId) as any;
    const error = resp.error;

    if (error) {
        redirect('/tools/user-management/management-users');
        return null;
    }

    const user = resp.user;

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
                                </div>
                                <p className=''>
                                    {user.email}
                                </p>
                            </div>

                        </div>

                        <div className='flex gap-6'>
                            <div>
                                <p className='text-xs font-bold'>
                                    Created at:
                                </p>
                                <p className='text-neutral-700'>
                                    {user.createdAt?.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className='text-xs font-bold'>
                                    Last login at:
                                </p>
                                <p className='text-neutral-700'>
                                    {user.lastLoginAt?.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <Separator />



                        <div>
                            <div className='text-xs font-bold flex items-center gap-2'>
                                sub:
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
                            <p className='text-neutral-700 font-mono'>
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
                            <p className='text-neutral-700 font-mono'>
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
