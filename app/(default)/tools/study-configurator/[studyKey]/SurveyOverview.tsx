'use client';

import { AuthAPIFetcher } from '@/utils/server/fetcher';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Button, Divider, Skeleton, Spinner } from '@nextui-org/react';
import { signOut } from 'next-auth/react';
import React from 'react';
import { BsCardChecklist, BsChevronRight, BsExclamationTriangle, BsPlus } from 'react-icons/bs';
import { Survey } from 'survey-engine/data_types';
import useSWR from 'swr';

interface SurveyOverviewProps {
    studyKey: string;
}


const NoSurveys: React.FC = () => {
    return (
        <div className='flex py-unit-md flex-col justify-center items-center text-center'>
            <BsCardChecklist className="text-3xl text-default-300 mb-unit-sm" />
            <h3 className='font-bold'>No surveys yet</h3>
            <p className='text-default-500  text-small'>Create a new survey to start collecting data.</p>
        </div>
    );
}

const SurveyCard: React.FC<{ surveyKey: string; studyKey: string }> = ({ surveyKey, studyKey }) => {
    const { data: surveyVersions, error, isLoading } = useSWR<{ surveyVersions?: Survey[] }>(`/api/case-management-api/v1/study/${studyKey}/survey/${surveyKey}/versions`, AuthAPIFetcher)

    let largestPublished = 0;
    if (surveyVersions && surveyVersions.surveyVersions) {
        surveyVersions.surveyVersions.forEach(sv => {
            if (!sv.published) {
                return;
            }
            if (typeof sv.published !== 'number') {
                sv.published = parseInt(sv.published as unknown as string);
            }
            if (sv.published > largestPublished) {
                largestPublished = sv.published;
            }
        })
    }

    const lastUpdated = new Date(largestPublished * 1000).toLocaleDateString();


    return (<Card radius='sm'>
        <div className='p-unit-sm flex items-center gap-unit-md'>
            <div className='grow'>

                <div className='font-bold'>
                    {surveyKey}
                </div>
                <div className='flex flex-col gap-unit-g'>
                    <Skeleton isLoaded={!isLoading}>
                        <div className='flex items-center gap-unit-1 text-small'>
                            <span className='text-default-400'>Last updated:</span>
                            {lastUpdated}
                        </div>
                    </Skeleton>
                    <Skeleton isLoaded={!isLoading}>
                        <div className='flex items-center gap-unit-2 text-small'>
                            <span className='text-default-400'>Number of versions:</span>
                            {surveyVersions && surveyVersions.surveyVersions ? surveyVersions.surveyVersions.length : 0}
                        </div>
                    </Skeleton>
                </div>

            </div>
            <Button
                variant='ghost'
            >
                Open Survey
                <BsChevronRight />
            </Button>
        </div>
    </Card>)
}


const SurveyList: React.FC<{ studyKey: string }> = ({ studyKey }) => {
    const { data: surveyKeys, error, isLoading } = useSWR<{ keys?: string[] }>(`/api/case-management-api/v1/study/${studyKey}/survey-keys`, AuthAPIFetcher)

    if (isLoading) {
        return <div className='py-unit-lg text-center'>
            <Spinner />
        </div>
    }

    let errorComp: React.ReactNode = null;
    if (error) {
        if (error.message === 'Unauthorized') {
            signOut({ callbackUrl: '/auth/login?callbackUrl=/tools/study-configurator/' });
            return null;
        }

        errorComp = <div className='bg-danger-50 gap-unit-md rounded-medium p-unit-md flex items-center mb-unit-md'>
            <div className='text-danger text-2xl'>
                <BsExclamationTriangle />
            </div>
            <div>
                <p className='text-danger font-bold'>Something went wrong</p>
                <p className='text-danger text-small'>{error.message}</p>
            </div>
        </div>
    }

    let list = <NoSurveys />;

    if (surveyKeys && surveyKeys.keys && surveyKeys.keys.length > 0) {
        list = <div className="grid grid-cols-1  gap-unit-lg">
            {surveyKeys.keys.map((key: string) => <SurveyCard key={key} studyKey={studyKey} surveyKey={key} />)}
        </div>
    }

    return (
        <>
            {errorComp}
            {list}
        </>
    )
}

const SurveyOverview: React.FC<SurveyOverviewProps> = (props) => {
    return (
        <Card
            className='bg-white/50'
            isBlurred
        >
            <CardHeader className="bg-content2">
                <h3 className='text-xl font-bold'>Surveys</h3>
            </CardHeader>
            <Divider />
            <CardBody className='max-h-[400px] overflow-y-scroll'>
                <SurveyList
                    studyKey={props.studyKey}
                />
            </CardBody>
            <Divider />
            <CardFooter>
                <Button
                    variant="flat"
                    color="primary"
                //as={NextUILink}
                // href="/tools/study-configurator/new"
                >
                    <BsPlus />
                    Create new survey
                </Button>
            </CardFooter>
        </Card>
    );
};

export default SurveyOverview;
