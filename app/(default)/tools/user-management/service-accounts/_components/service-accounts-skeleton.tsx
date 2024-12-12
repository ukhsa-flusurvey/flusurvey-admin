import React from 'react';
import CardWrapper from './card-wrapper';
import { Skeleton } from '@/components/ui/skeleton';


const ManagementUsersLoader: React.FC = () => {
    return (
        <CardWrapper>
            <p className='sr-only'>Loading...</p>
            <div className='divide-y divide-black/10'>
                <div className='py-2 my-0 flex gap-3 items-center'>
                    <Skeleton className='h-10 w-full' />
                </div>
                <div className='py-2 my-0 flex gap-3 items-center'>
                    <Skeleton className='h-10 w-full' />
                </div>


            </div>
        </CardWrapper>
    );
};

export default ManagementUsersLoader;
