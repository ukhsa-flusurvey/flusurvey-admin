import React from 'react';
import WrapperCard from './WrapperCard';
import { getStudy } from '@/lib/data/studyAPI';
import ErrorAlert from '@/components/ErrorAlert';
import DisplayTexts from './DisplayTexts';

interface DisplayTextsCardProps {
    studyKey: string;
}

const Wrapper = (props: { children: React.ReactNode }) => {
    return (
        <WrapperCard
            title={'Display Texts'}
            description={'If the instance supports study selection, the display texts can be edited here.'}
        >
            {props.children}
        </WrapperCard>
    )
}

const DisplayTextsCard: React.FC<DisplayTextsCardProps> = async (props) => {
    const resp = await getStudy(props.studyKey);

    const error = resp.error;
    const study = resp.study;
    if (error || !study) {
        return <ErrorAlert
            title="Error loading display texts"
            error={error || 'No study found'}
        />
    }

    return (
        <Wrapper>
            <DisplayTexts
                studyKey={study.key}
                studyProps={study.props}
            />
        </Wrapper>
    );
};

export default DisplayTextsCard;

export const DisplayTextsCardSkeleton: React.FC = () => {
    return (
        <Wrapper>
            <DisplayTexts
                studyKey='...'
                studyProps={{
                    name: [],
                    description: [],
                    tags: [],
                    systemDefaultStudy: false,
                }}
            />
        </Wrapper >
    );
}
