import React from 'react';
import IsDefaultStudyToggle from './IsDefaultStudyToggle';
import { Skeleton } from '@/components/ui/skeleton';
import { getStudy } from '@/lib/data/studyAPI';
import ErrorAlert from '@/components/ErrorAlert';
import WrapperCard from './WrapperCard';

interface IsDefaultStudyCardProps {
    studyKey: string;
}

const Wrapper = (props: { children: React.ReactNode }) => {
    return (
        <WrapperCard
            title={'Default Study'}
            description={'If the study is the default study, all participants will be assigned to this study by default once they log in. If the study is not the default study, participants need to join the study manually.'}
        >
            {props.children}
        </WrapperCard>
    )
}

const IsDefaultStudyCard: React.FC<IsDefaultStudyCardProps> = async (props) => {
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
            <IsDefaultStudyToggle
                studyKey={props.studyKey}
                isDefaultStudy={study?.props.systemDefaultStudy || false}
            />
        </Wrapper>
    );
};

export default IsDefaultStudyCard;

export const IsDefaultStudyCardSkeleton: React.FC = () => {
    return (
        <Wrapper>
            <Skeleton className='h-8 w-20' />
        </Wrapper>
    );
}
