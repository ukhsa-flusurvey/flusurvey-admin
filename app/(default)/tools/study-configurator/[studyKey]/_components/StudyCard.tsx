import ErrorAlert from '@/components/ErrorAlert';
import { getStudy } from '@/lib/data/studyAPI';
import React from 'react';
import StudyCardClientComp from './StudyCardClientComp';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import LinkButton, { LinkButtonSkeleton } from './LinkButton';

interface StudyCardProps {
    studyKey: string;
}

const StudyCard: React.FC<StudyCardProps> = async (props) => {
    const resp = await getStudy(props.studyKey);
    const study = resp.study;
    const error = resp.error;
    if (error || !study) {
        return <ErrorAlert
            title="Error loading study"
            error={error || 'Study not found'}
        />
    }


    return (
        <Card
            variant={'opaque'}
            className='p-6'
        >
            <h3 className='font-semibold mb-2'>Study card preview</h3>
            <StudyCardClientComp
                study={study}
            />
            <LinkButton
                href={'/tools/study-configurator/' + props.studyKey + '/settings'}
                text={'Go to study settings'}
            />
        </Card>
    );

};

export default StudyCard;

export const StudyCardSkeleton: React.FC = () => {
    return (
        <Card
            variant={'opaque'}
            className='p-6'
        >
            <h3 className='font-semibold mb-2'>Study card preview</h3>
            <Skeleton className='h-[166px] w-full' />
            <LinkButtonSkeleton
                text={'Go to study settings'}
            />
        </Card>
    );
}
