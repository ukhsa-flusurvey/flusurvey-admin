'use client'

import LoadingButton from '@/components/LoadingButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { deleteServiceAccount } from '@/lib/data/service-accounts';
import { AlertTriangle } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

interface DeleteServiceAccount {
    serviceAccountID: string;
}

const DeleteServiceAccount: React.FC<DeleteServiceAccount> = (props) => {
    const [isPending, startTransition] = React.useTransition();

    const deleteUser = async () => {
        if (!confirm('Are you sure you want to delete this service user?')) return;

        startTransition(async () => {
            const resp = await deleteServiceAccount(props.serviceAccountID);
            if (resp.error) {
                toast.error(resp.error);
                return;
            }
            toast.success('Service account deleted successfully');
            redirect('/tools/user-management/service-accounts');
        });
    }


    return (
        <Card
            variant={"opaque"}
            className='max-w-full'
        >
            <CardHeader>
                <CardTitle>
                    Delete Service Account
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='px-3 py-2 rounded-lg bg-yellow-100 text-yellow-800 flex gap-6 items-center'>
                    <div>
                        <AlertTriangle className='size-10 inline-block' />
                    </div>
                    <div className='text-sm font-bold space-y-2'>
                        <p>
                            Deleting a service account will remove all their permissions and API keys from the system.
                        </p>
                    </div>
                </div>
                <LoadingButton
                    isLoading={isPending}
                    variant={"destructive"}
                    className='mt-6'
                    onClick={deleteUser}
                >
                    Delete Service Account
                </LoadingButton>
            </CardContent>

        </Card>
    );
};

export default DeleteServiceAccount;
