import ErrorAlert from '@/components/ErrorAlert';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getStudy } from '@/lib/data/studyAPI';
import React from 'react';
import StatusToggle from './StatusToggle';

interface StatusCardProps {
    studyKey: string;
}


const StatusCard: React.FC<StatusCardProps> = async (props) => {
    const resp = await getStudy(props.studyKey);

    const error = resp.error;
    if (error) {
        return <ErrorAlert
            title="Error loading study status"
            error={error}
        />
    }

    const study = resp.study;

    return (
        <Card
            variant={'opaque'}
            className='p-6'
        >
            <div className='flex sm:min-w-[440px] gap-6'>
                <div className='space-y-2 grow'>
                    <div>
                        <p className='mb-1 font-semibold'>Study Key</p>
                        <p className='text-cyan-800 text-2xl font-bold'>
                            {props.studyKey}
                        </p>
                    </div>
                    {study?.props.systemDefaultStudy && <Badge className='mb-1'>
                        System Default
                    </Badge>}
                </div>
                <div>
                    <StatusToggle
                        studyKey={props.studyKey}
                        status={study?.status || 'inactive'}
                    />
                </div>
            </div>
        </Card>
    );
};

export default StatusCard;

export const StatusCardSkeleton: React.FC = () => {
    return (
        <Card
            variant={'opaque'}
            className='p-6'
        >
            <div className='flex sm:min-w-[440px] gap-6'>
                <div className='space-y-2 grow'>
                    <div>
                        <p className='mb-1 font-semibold'>Study Key</p>
                        <Skeleton className='h-10 w-32' />

                    </div>
                </div>
                <div>
                    <Skeleton className='h-8 w-24' />
                </div>
            </div>
        </Card>
    );
}
