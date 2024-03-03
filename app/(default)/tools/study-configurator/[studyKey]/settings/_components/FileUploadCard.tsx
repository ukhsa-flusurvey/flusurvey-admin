import React from 'react';
import WrapperCard from './WrapperCard';

interface FileUploadCardProps {
    studyKey: string;
}

const Wrapper = (props: { children: React.ReactNode }) => {
    return (
        <WrapperCard
            title={'File Upload'}
            description={'File upload settings for the study.'}
        >
            {props.children}
        </WrapperCard>
    )
}

const FileUploadCard: React.FC<FileUploadCardProps> = async (props) => {
    // wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    return (
        <Wrapper>
            <p>
                file upload allowed, not allowed

            </p>
            <p>
                simple mode: true, false
            </p>
            <p>
                advanced mode: decided each time per study rule for participant
            </p>
        </Wrapper>
    );
};

export default FileUploadCard;

export const FileUploadCardSkeleton: React.FC = () => {
    return (
        <Wrapper>
            <p>FileUploadCardSkeleton</p>
        </Wrapper >
    );
}
