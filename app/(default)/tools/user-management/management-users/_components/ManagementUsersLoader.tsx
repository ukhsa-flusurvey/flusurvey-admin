import React from 'react';
import CardWrapper from './CardWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ManagementUsersLoaderProps {
}

const ManagementUsersLoader: React.FC<ManagementUsersLoaderProps> = (props) => {
    return (
        <CardWrapper>
            <p className='sr-only'>Loading...</p>
            <div className='divide-y divide-black/10'>
                <div className='px-3 py-2 my-0 flex gap-3 items-center'>
                    <Skeleton className='size-10 rounded-full' />
                    <Skeleton className='h-10 w-80' />
                    <div className='grow'></div>
                    <ChevronRight className='size-6 text-neutral-300' />
                </div>
                <div className='px-3 py-2 my-0 flex gap-3 items-center'>
                    <Skeleton className='size-10 rounded-full' />
                    <Skeleton className='h-10 w-80' />
                    <div className='grow'></div>
                    <ChevronRight className='size-6 text-neutral-300' />
                </div>


            </div>
        </CardWrapper>
    );
};

export default ManagementUsersLoader;
