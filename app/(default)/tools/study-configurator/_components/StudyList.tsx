'use client'

import { AuthAPIFetcher } from '@/utils/server/fetcher';
import { Study } from '@/utils/server/types/studyInfos';
import { Spinner, Card, CardBody, Link as NextUILink, Chip } from '@nextui-org/react';
import { signOut } from 'next-auth/react';
import React from 'react';
import { BsChevronRight, BsDot, BsExclamationTriangle, BsJournalMedical } from 'react-icons/bs';
import useSWR from 'swr';

interface StudyListProps {
}

const StudyCard = (props: { study: Study }) => {
    return <Card shadow='none'
        className="border border-default-400 bg-gradient-to-r from-content2 to-content1"
        radius='sm'
        isPressable
        as={NextUILink}
        href={`/tools/study-configurator/${props.study.key}`}
    >
        <CardBody className='p-unit-sm'>
            <div className=' flex'>
                <div className='grow'>
                    <div className='text-lg font-bold'>
                        {props.study.key}
                        {props.study.props.systemDefaultStudy && <Chip color='default' variant='flat' size='sm' className='ml-unit-sm'>Default</Chip>}
                    </div>
                    <div className='text-small flex items-center mt-unit-1'>
                        <span className='me-1 text-default-500'>Participants: </span>
                        <span>{(props.study.stats.participantCount || 0) + (props.study.stats.tempParticipantCount || 0)}</span>
                        <span><BsDot /></span>
                        <span className='me-1 text-default-500'>Responses: </span>
                        <span>{props.study.stats.responseCount || 0}</span>
                    </div>

                </div>
                <div className='flex items-center gap-unit-sm'>
                    <Chip
                        variant='dot'
                        color={
                            props.study.status === 'active' ? 'success' : 'default'
                        }>
                        {props.study.status}
                    </Chip>
                    <BsChevronRight />
                </div>
            </div>

        </CardBody>
    </Card>
}

const StudyList: React.FC<StudyListProps> = (props) => {
    const { data, error, isLoading } = useSWR<{ studies: Study[] }>(`/api/case-management-api/v1/studies`, AuthAPIFetcher)

    if (isLoading) {
        return <div className='py-unit-lg text-center'>
            <Spinner />
        </div>
    }

    let errorComp: React.ReactNode = null;
    if (error) {
        if (error.message === 'Unauthorized') {
            signOut({ callbackUrl: '/auth/login?callbackUrl=/tools/study-configurator' });
            return null;
        }

        errorComp = <div className='bg-danger-50 gap-unit-md rounded-medium p-unit-md flex items-center'>
            <div className='text-danger text-2xl'>
                <BsExclamationTriangle />
            </div>
            <div>
                <p className='text-danger font-bold'>Something went wrong</p>
                <p className='text-danger text-small'>{error.message}</p>
            </div>
        </div>
    }

    let studyList = <div className="flex py-unit-md flex-col justify-center items-center text-center">
        <BsJournalMedical className="text-3xl text-default-300 mb-unit-sm" />
        <p className="font-bold ">No studies</p>
        <p className="text-default-500 text-small">Get started by adding a new study</p>
    </div>

    if (data && data.studies && data.studies.length > 0) {
        const studies = data.studies.map((study: Study) => {
            return {
                ...study,
                stats: {
                    participantCount: typeof (study.stats.participantCount) === 'string' ? parseInt(study.stats.participantCount) : study.stats.participantCount,
                    tempParticipantCount: typeof (study.stats.tempParticipantCount) === 'string' ? parseInt(study.stats.tempParticipantCount) : study.stats.tempParticipantCount,
                    responseCount: typeof (study.stats.responseCount) === 'string' ? parseInt(study.stats.responseCount) : study.stats.responseCount,
                }
            }
        })
        studyList = <div className="grid grid-cols-1  gap-unit-lg">
            {studies.map((study: Study) => <StudyCard key={study.key}
                study={study}
            />)}
        </div>
    }

    return (
        <>
            {errorComp}
            {studyList}
        </>
    );
};

export default StudyList;
