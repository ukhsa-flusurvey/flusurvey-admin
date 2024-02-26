'use client';

import { deletePermissionForManagementUser } from '@/actions/user-management/permissions';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import React, { useTransition } from 'react';
import { BeatLoader } from 'react-spinners';
import { toast } from 'sonner';

interface PermissionActionsProps {
    userId: string;
    permission: any;
}

const PermissionActions: React.FC<PermissionActionsProps> = (props) => {
    const [isPending, startTransition] = useTransition();

    const handleOnDelete = () => {
        if (confirm('Are you sure you want to delete this permission?')) {
            startTransition(async () => {
                const resp = await deletePermissionForManagementUser(props.userId, props.permission.id)
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                toast.success('Permission deleted');
            });
        }
    }

    return (
        <div className='gap-2 flex justify-end items-center'>
            {!isPending && <><Button
                variant={'ghost'}
                size={'icon'}
                className='size-8'
            >
                <Pencil className='size-4' />
            </Button>
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
