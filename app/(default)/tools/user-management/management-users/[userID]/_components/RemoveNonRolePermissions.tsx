'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deletePermissionForManagementUser } from '@/actions/user-management/permissions';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { ManagementUserPermission } from '@/lib/data/userManagementAPI';
import { EraserIcon } from 'lucide-react';
import LoadingButton from '@/components/loading-button';

interface RemoveNonRolePermissionsButtonProps {
    userId: string;
    permissions: ManagementUserPermission[];
}

const RemoveNonRolePermissionsButton: React.FC<RemoveNonRolePermissionsButtonProps> = ({ userId, permissions }) => {
    const [open, setOpen] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();

    const removablePermissions = React.useMemo(
        () => permissions.filter((permission) => permission.id),
        [permissions],
    );

    const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (removablePermissions.length === 0) {
            toast.error('Unable to remove permissions without identifiers.');
            return;
        }

        startTransition(async () => {
            try {
                const errors: string[] = [];

                for (const permission of removablePermissions) {
                    if (!permission.id) {
                        continue;
                    }
                    const resp = await deletePermissionForManagementUser(userId, permission.id);
                    if (resp?.error) {
                        errors.push(resp.error);
                    }
                }

                if (errors.length > 0) {
                    toast.error('Failed to remove some permissions', {
                        description: errors.join('\n'),
                    });
                    return;
                }

                toast.success('Permissions removed');
                setOpen(false);
            } catch (error: unknown) {
                toast.error('Failed to remove permissions', {
                    description: getErrorMessage(error),
                });
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={(nextOpen) => !isPending && setOpen(nextOpen)}>
            <AlertDialogTrigger asChild>
                <Button
                    variant={'outline'}
                    disabled={permissions.length === 0}
                >
                    <EraserIcon className='size-4' />
                    Remove Permissions without App Role
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove permissions not tied to an app role</AlertDialogTitle>
                    <AlertDialogDescription>
                        The following permissions are not required by any assigned app role. Removing them will revoke the access listed below.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='max-h-60 overflow-y-auto rounded-md border border-border bg-muted/40 p-3 text-sm'>
                    <ul className='space-y-2'>
                        {permissions.map((permission) => (
                            <li key={permission.id ?? `${permission.resourceType}-${permission.resourceKey}-${permission.action}`} className='rounded-md border border-border bg-background px-3 py-2 shadow-sm'>
                                <div className='font-semibold'>
                                    <span className='font-normal'>{permission.resourceType}/</span>
                                    <span className='font-bold'>{permission.resourceKey}</span>
                                </div>
                                <div className='text-xs uppercase tracking-wide text-muted-foreground'>Action: {permission.action}</div>
                                {permission.limiter && (
                                    <pre className='mt-2 overflow-x-auto whitespace-pre-wrap rounded bg-slate-100 p-2 text-xs font-mono'>{JSON.stringify(permission.limiter, null, 2)}</pre>
                                )}
                                {!permission.id && (
                                    <p className='mt-2 text-xs font-medium text-red-600'>This permission cannot be removed automatically because it lacks an identifier.</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        asChild
                    >
                        <LoadingButton
                            isLoading={isPending}
                            onClick={handleRemove}
                        >
                            Remove {removablePermissions.length} permission{removablePermissions.length === 1 ? '' : 's'}
                        </LoadingButton>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default RemoveNonRolePermissionsButton;


