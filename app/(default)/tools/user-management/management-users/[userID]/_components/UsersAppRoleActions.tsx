'use client';

import React, { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { BeatLoader } from 'react-spinners';
import { deleteAppRoleForManagementUserAction } from '@/actions/user-management/app-roles';

interface UsersAppRoleActionsProps {
    userId: string;
    appRoleId: string;
}

const UsersAppRoleActions: React.FC<UsersAppRoleActionsProps> = (props) => {
    const [isPending, startTransition] = useTransition();

    const handleOnDelete = () => {
        if (confirm('Removing this app role will NOT remove the permissions it added. Continue?')) {
            startTransition(async () => {
                const resp = await deleteAppRoleForManagementUserAction(props.userId, props.appRoleId);
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                toast.success('App role removed');
            });
        }
    }

    return (
        <div className='gap-2 flex justify-end items-center'>
            {!isPending && (
                <Button
                    variant={'ghost'}
                    size={'icon'}
                    className='size-8'
                    onClick={handleOnDelete}
                >
                    <Trash2 className='size-4' />
                </Button>
            )}
            <BeatLoader loading={isPending} />
        </div>
    );
}

export default UsersAppRoleActions;


