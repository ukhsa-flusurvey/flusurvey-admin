import { Study } from '@/utils/server/types/studyInfos';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Chip } from '@nextui-org/chip';
import React from 'react';
import NotImplemented from '@/components/NotImplemented';

interface StudyOverviewProps {
    study: Study;
}

const StudyOverview: React.FC<StudyOverviewProps> = (props) => {

    const studyStats = <div className='flex'>
        <div className='flex flex-col grow text-end'>
            <span className='text-default-400 text-small'>
                Participant count
            </span>
            <span className='text-2xl font-bold'>
                {props.study.stats.participantCount || 0}
            </span>
        </div>

        <div className='flex flex-col grow text-end'>
            <span className='text-default-400 text-small'>
                Temporary participants
            </span>
            <span className='text-2xl font-bold'>
                {props.study.stats.tempParticipantCount || 0}
            </span>
        </div>

        <div className='flex flex-col grow'>
            <span className='text-default-400 text-small text-end'>
                Response count
            </span>
            <span className='text-2xl font-bold text-end'>
                {props.study.stats.responseCount || 0}
            </span>
        </div>
    </div>

    return (
        <Card
            className='bg-white/50 col-span-2'
            isBlurred
        >
            <CardHeader className="bg-content2">
                <h3 className='text-xl font-bold'>Properties</h3>
            </CardHeader>
            <Divider />
            <CardBody className=''>
                <div className=' flex flex-col h-full gap-unit-md'>
                    <div className='flex gap-unit-md'>
                        <div className='flex flex-col grow'>
                            <span className='text-default-400 text-small'>
                                Study Key
                            </span>
                            <span className='text-2xl text-primary font-bold'>
                                {props.study.key} {props.study.props.systemDefaultStudy && <span className='text-default-500 text-sm'>Default</span>}
                            </span>
                        </div>
                        <div className='flex flex-col text-end'>
                            <span className='text-default-400 text-small mb-1'>
                                ID mapping method
                            </span>
                            <span className='text-large font-bold'>
                                {props.study.configs.idMappingMethod || 'default'}
                            </span>
                        </div>
                        <div className='flex flex-col text-end'>
                            <span className='text-default-400 text-small mb-unit-1'>
                                Status
                            </span>
                            <Chip
                                variant='dot'
                                color={
                                    props.study.status === 'active' ? 'success' : 'default'
                                }
                            >
                                {props.study.status}
                            </Chip>
                        </div>

                    </div>
                    <Divider />
                    <div className='flex gap-unit-md'>
                        <div className='flex flex-col gap-unit-md'>


                        </div>

                        <div>
                            <NotImplemented>language selector</NotImplemented>
                            <NotImplemented>name, description, tags</NotImplemented>
                        </div>
                    </div>
                    <div className='grow'></div>
                    <Divider />
                    {studyStats}
                </div>
            </CardBody>

        </Card>
    );
};

export default StudyOverview;
