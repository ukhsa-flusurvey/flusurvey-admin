import React from 'react';
import WrapperCard from './WrapperCard';
import { getStudy } from '@/lib/data/studyAPI';
import ErrorAlert from '@/components/ErrorAlert';
import { Study } from '@/utils/server/types/studyInfos';
import FileUploadToggle from './FileUploadToggle';
import { Skeleton } from '@/components/ui/skeleton';

interface FileUploadCardProps {
    studyKey: string;
}

const Wrapper = (props: { children: React.ReactNode }) => {
    return (
        <WrapperCard
            title={'File Upload'}
            description={'Config if participants can upload files.'}
        >
            {props.children}
        </WrapperCard>
    )
}

const isFileUploadAllowedSimplified = (study?: Study) => {
    if (!study) {
        return false;
    }

    if (study.configs.participantFileUploadRule === undefined || study.configs.participantFileUploadRule === null) {
        return false;
    }

    console.log('study.configs.participantFileUploadRule', study.configs.participantFileUploadRule);

    const rule = study.configs.participantFileUploadRule;
    if (rule.name !== 'gt' || rule.data === undefined || rule.data.length < 2) {
        return false;
    }

    const v1 = rule.data[0].num || 0;
    const v2 = rule.data[1].num || 0;

    return v1 > v2;
}


const FileUploadCard: React.FC<FileUploadCardProps> = async (props) => {
    const resp = await getStudy(props.studyKey);

    const error = resp.error;
    if (error) {
        return <ErrorAlert
            title="Error loading file upload settings"
            error={error}
        />
    }

    const study = resp.study;

    const fileUploadAllowed = isFileUploadAllowedSimplified(study);


    return (
        <Wrapper>
            <FileUploadToggle
                studyKey={props.studyKey}
                simplifiedFileUploadConfigValue={fileUploadAllowed}
            />
        </Wrapper>
    );
};

export default FileUploadCard;

export const FileUploadCardSkeleton: React.FC = () => {
    return (
        <Wrapper>
            <Skeleton className='h-8 w-20' />
        </Wrapper >
    );
}
