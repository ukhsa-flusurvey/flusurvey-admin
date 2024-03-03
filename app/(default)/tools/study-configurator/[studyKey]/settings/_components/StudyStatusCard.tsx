import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import StatusToggle from '../../_components/StatusToggle';
import { getStudy } from '@/lib/data/studyAPI';
import ErrorAlert from '@/components/ErrorAlert';
import { Skeleton } from '@/components/ui/skeleton';

interface StudyStatusCardProps {
    studyKey: string;
}

const Wrapper = (props: { children: React.ReactNode }) => {
    return (
        <Card
            variant={'opaque'}
        >
            <CardHeader>
                <CardTitle>
                    Study Status
                </CardTitle>
                <CardDescription>
                    Study status defines whether the study is visible to participants and whether data collection is active.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {props.children}
            </CardContent>
        </Card>
    )
}

const StudyStatusCard: React.FC<StudyStatusCardProps> = async (props) => {
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
        <Wrapper>
            <div className='flex items-center gap-2'>
                <p>
                    Current status:
                </p>
                <StatusToggle
                    studyKey={props.studyKey}
                    status={study?.status || 'inactive'}
                />
            </div>
        </Wrapper>
    );
};

export default StudyStatusCard;

export const StudyStatusCardSkeleton: React.FC = () => {
    return (
        <Wrapper>
            <div className='flex items-center gap-2'>
                <p>
                    Current status:
                </p>
                <Skeleton className='h-10 w-24' />
            </div>
        </Wrapper>
    );
}
