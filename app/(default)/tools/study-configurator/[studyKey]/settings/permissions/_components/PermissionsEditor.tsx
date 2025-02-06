'use client';

import { deleleStudyPermission } from '@/actions/study/permissions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { PermissionsInfo } from '@/lib/data/studyAPI';
import { cn } from '@/lib/utils';
import { MoreVertical, UserRound } from 'lucide-react';
import React from 'react';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';


interface PermissionsEditorProps {
    studyKey: string;
    permissions: {
        [key: string]: PermissionsInfo;
    };
}

const PermissionsEditor: React.FC<PermissionsEditorProps> = (props) => {
    const userIds = Object.keys(props.permissions);

    return (
        <ul className='space-y-3'>
            {userIds.map((userId) => {

                return (
                    <li key={userId}>
                        <UserPermissions
                            studyKey={props.studyKey}
                            permission={props.permissions[userId]}
                        />
                    </li>
                )
            })}
        </ul>
    );
};

export default PermissionsEditor;

interface UserPermissionsProps {
    studyKey: string;
    permission: PermissionsInfo;
}

const UserPermissions = (props: UserPermissionsProps) => {
    const [isPending, startTransition] = React.useTransition();

    const user = props.permission.user;

    const removeAllPermissions = () => {
        if (!confirm('Are you sure you want to remove all permissions for this user?')) {
            return;
        }

        startTransition(async () => {
            try {
                for (const perm of props.permission.permissions) {
                    const resp = await deleleStudyPermission(props.studyKey, perm.id);

                    if (resp.error) {
                        toast.error(resp.error);
                    }
                }
                toast.success('Permissions removed');

            } catch (e: unknown) {
                toast.error('Failed to remove permissions', { description: (e as Error).message });
            }
        });
    }

    const removePermission = (permissionId: string) => {
        if (!confirm('Are you sure you want to remove this permission?')) {
            return;
        }

        startTransition(async () => {
            try {
                const resp = await deleleStudyPermission(props.studyKey, permissionId);

                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }

                toast.success('Permission removed');
            } catch (e: unknown) {
                toast.error('Failed to remove permission', { description: (e as Error).message });
            }
        });
    }


    const includesPermissions = props.permission.permissions !== undefined && props.permission.permissions.length > 0;

    return (
        <div className='p-3 bg-neutral-50 rounded-lg border border-black/20'>
            <div className={cn({
                'border-b pb-3': includesPermissions
            }
            )}>
                <div className='flex gap-4 items-center'>
                    <Avatar className='size-8'>
                        <AvatarImage src={user.imageUrl || ""} />
                        <AvatarFallback className="bg-slate-400">
                            <UserRound className='text-white size-6' />
                        </AvatarFallback>
                    </Avatar>
                    <div className='grow'>
                        <div className='font-bold'>
                            {user.username}
                        </div>
                        <p className='text-sm'>
                            {user.email}
                        </p>
                    </div>

                    {includesPermissions && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    size={'icon'}
                                    disabled={isPending}
                                >
                                    <MoreVertical className='size-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align='end'
                            >
                                <DropdownMenuItem
                                    className='text-red-600'
                                    onClick={removeAllPermissions}
                                    disabled={isPending}
                                >
                                    Remove all permissions for this user
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            <BarLoader
                className='rounded-sm'
                width={'100%'}
                loading={isPending}
            />

            {includesPermissions && (
                <div>
                    <ul className=''>
                        {props.permission.permissions.map((perm) => (
                            <li key={perm.id}
                                className='flex gap-4 items-center rounded-md ps-12  hover:bg-slate-100 relative py-1'
                            >
                                <div className='grow'>
                                    <span className='font-mono text-sm'>{perm.action}</span>
                                    {perm.limiter && (<p className='text-xs mt-0.5 ps-6 font-mono'>
                                        {JSON.stringify(perm.limiter, null, 1)}
                                    </p>)}

                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            className=''
                                            variant={'ghost'}
                                            size={'icon'}
                                            disabled={isPending}
                                        >
                                            <MoreVertical className='size-4' />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align='end'
                                    >
                                        <DropdownMenuItem
                                            className='text-red-600'
                                            onClick={() => removePermission(perm.id)}
                                            disabled={isPending}
                                        >
                                            Remove this permission
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
