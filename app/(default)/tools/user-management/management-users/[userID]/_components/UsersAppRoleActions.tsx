'use client';

import React, { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { BeatLoader } from 'react-spinners';
import { deleteAppRoleForManagementUserAction } from '@/actions/user-management/app-roles';
import { useRouter } from 'next/navigation';
import getErrorMessage from '@/utils/getErrorMessage';

interface UsersAppRoleActionsProps {
    userId: string;
    appRoleId: string;
}

const UsersAppRoleActions: React.FC<UsersAppRoleActionsProps> = (props) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleOnDelete = () => {
        if (confirm('Removing this app role will NOT remove the permissions it added. Continue?')) {
            startTransition(async () => {
                try {
                    const resp = await deleteAppRoleForManagementUserAction(props.userId, props.appRoleId);
                    if (resp.error) {
                        toast.error(`Failed to remove app role`, { description: resp.error });
                        return;
                    }
                    toast.success('App role removed');
                    router.refresh();
                } catch (error: unknown) {
                    toast.error('Failed to remove app role', { description: getErrorMessage(error) });
                }
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


