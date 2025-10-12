'use client';

import { deletePermissionForManagementUser } from '@/actions/user-management/permissions';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import React, { useTransition } from 'react';
import { BeatLoader } from 'react-spinners';
import { toast } from 'sonner';
import UpdatePermissionLimiterDialog from './UpdatePermissionLimiterDialog';
import { getIfHideLimiter } from './AddPermissionDialog';
import { ManagementUserPermission } from '@/lib/data/userManagementAPI';
import { deletePermissionForServiceAccount } from '@/lib/data/service-accounts';
import getErrorMessage from '@/utils/getErrorMessage';

interface PermissionActionsProps {
    userId: string;
    permission: ManagementUserPermission;
    userType?: 'service-account' | 'management-user';
}

const PermissionActions: React.FC<PermissionActionsProps> = (props) => {
    const [isPending, startTransition] = useTransition();

    const handleOnDelete = () => {
        if (confirm('Are you sure you want to delete this permission?')) {
            startTransition(async () => {
                if (!props.permission.id) {
                    toast.error('Permission ID not defined but is required');
                    return;
                }
                try {
                    if (props.userType === 'service-account') {
                        const resp = await deletePermissionForServiceAccount(props.userId, props.permission.id)
                        if (resp.error) {
                            toast.error(resp.error);
                            return;
                        }
                        toast.success('Permission deleted');
                        return;
                    } else {
                        const resp = await deletePermissionForManagementUser(props.userId, props.permission.id)
                        if (resp.error) {
                            toast.error(resp.error);
                            return;
                        }
                        toast.success('Permission deleted');
                    }
                } catch (error: unknown) {
                    toast.error('Failed to delete permission', { description: getErrorMessage(error) });
                }
            });
        }
    }

    const hideLimiterUpdater = getIfHideLimiter(props.permission.resourceType, props.permission.resourceKey, props.permission.action)

    return (
        <div className='gap-2 flex justify-end items-center'>
            {!isPending && <>
                {!hideLimiterUpdater && <UpdatePermissionLimiterDialog
                    userID={props.userId}
                    permission={props.permission}
                >
                    <Button
                        variant={'ghost'}
                        size={'icon'}
                        className='size-8'
                    >
                        <Pencil className='size-4' />
                    </Button>
                </UpdatePermissionLimiterDialog>}
                <Button
                    variant={'ghost'}
                    size={'icon'}
                    className='size-8'
                    onClick={handleOnDelete}
                >
                    <Trash2 className='size-4' />
                </Button>
            </>}
            <BeatLoader
                loading={isPending}
            />
        </div>
    );
};

export default PermissionActions;
