'use client'

import LoadingButton from '@/components/LoadingButton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import React from 'react';

interface DeleteUserCardProps {
    userId: string;
}

const DeleteUserCard: React.FC<DeleteUserCardProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();

    const deleteUser = async () => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        startTransition(async () => {
            await new Promise(resolve => setTimeout(resolve, 3000));
        });
    }


    return (
        <Card
            variant={"opaque"}
            className='max-w-full'
        >
            <CardHeader>
                <h2 className='text-lg font-bold'>Delete User</h2>
            </CardHeader>
            <CardContent>
                <div className='px-3 py-2 rounded-lg bg-yellow-100 text-yellow-800 flex gap-6 items-center'>
                    <div>
                        <AlertTriangle className='size-10 inline-block' />
                    </div>
                    <div className='text-sm font-bold space-y-2'>
                        <p>
                            Deleting a user will remove all their permissions and sessions from the system.
                        </p>
                        <p>
                            To actually revoke full access to the system, you need to remove access through the Identity Provider.
                        </p>
                    </div>
                </div>
                <LoadingButton
                    isLoading={isPending}
                    variant={"destructive"}
                    className='mt-6'
                    onClick={deleteUser}
                >
                    Delete User
                </LoadingButton>
            </CardContent>

        </Card>
    );
};

export default DeleteUserCard;
