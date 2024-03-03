import { Card } from '@/components/ui/card';
import React from 'react';

interface StatusCardProps {
    studyKey: string;
}


const StatusCard: React.FC<StatusCardProps> = async (props) => {
    // wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    return (
        <Card
            variant={'opaque'}
            className='p-6'
        >
            <p>StatusCard</p>
        </Card>
    );
};

export default StatusCard;

export const StatusCardSkeleton: React.FC = () => {
    return (
        <p>StatusCardSkeleton</p>
    );
}
