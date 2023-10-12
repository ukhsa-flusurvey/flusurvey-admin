'use client';

import { AuthAPIFetcher } from '@/utils/server/fetcher';
import { Button, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { signOut } from 'next-auth/react';
import React from 'react';
import { BsCloudArrowUp, BsPencilSquare } from 'react-icons/bs';
import { Survey } from 'survey-engine/data_types';
import useSWR from 'swr';
import UploadSurveyDialog from './UploadSurveyDialog';

interface SurveyHistoryViewProps {
    studyKey: string;
    surveyKey: string;
}

const SurveyHistoryView: React.FC<SurveyHistoryViewProps> = (props) => {
    const { data: surveyVersions, error, isLoading } = useSWR<{ surveyVersions?: Survey[] }>(`/api/case-management-api/v1/study/${props.studyKey}/survey/${props.surveyKey}/versions`, AuthAPIFetcher)

    const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);

    if (error) {
        if (error.message === 'Unauthorized') {
            signOut({ callbackUrl: `/auth/login?callbackUrl=/tools/study-configurator/${props.studyKey}/survey/${props.surveyKey}` });
            return null;
        }
    }

    console.log(error);
    console.log(isLoading)
    console.log(surveyVersions);


    return (
        <>
            <Card
                className='bg-white/50'
                isBlurred
            >
                <CardHeader className="bg-content2">
                    <h3 className='text-xl'>Survey:
                        <span className='font-bold ml-2'>
                            {props.surveyKey}
                        </span>
                    </h3>
                </CardHeader>
                <Divider />
                <CardBody className='max-h-[400px] overflow-y-scroll'>
                    <div className='space-x-unit-md'>
                        <Button
                            startContent={<BsCloudArrowUp />}
                            color='secondary'
                            variant='flat'
                            onPress={() => { setUploadDialogOpen(true) }}
                        >
                            Upload New Version
                        </Button>
                        <Button
                            startContent={<BsPencilSquare />}
                            color='primary'
                            variant='flat'
                            isDisabled
                        >
                            Open Current Version in Editor
                        </Button>
                    </div>

                    <h4 className='font-bold text-lg mt-unit-md'>
                        History
                    </h4>

                    <p>todo: history view</p>
                </CardBody>

            </Card>
            <UploadSurveyDialog
                studyKey={props.studyKey}
                surveyKey={props.surveyKey}
                isOpen={uploadDialogOpen}
                onOpenChange={(open) => { setUploadDialogOpen(open) }}
            />
        </>
    );
};

export default SurveyHistoryView;
