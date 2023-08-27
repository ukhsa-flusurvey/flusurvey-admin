'use client'

import AvatarFromId from '@/components/AvatarFromID';
import { ParticipantState } from '@/utils/server/types/participantState';
import { Card, CardBody, CardHeader, Chip, Divider, Snippet } from '@nextui-org/react';
import { format } from 'date-fns';
import React from 'react';
import { BsActivity, BsBoxArrowInRight, BsPerson, BsPersonVcard } from 'react-icons/bs';

interface ParticipantDetailsProps {
    participant?: ParticipantState;
}

const ParticipantDetails: React.FC<ParticipantDetailsProps> = (props) => {

    if (!props.participant) {
        return (
            <div className='px-unit-md gap-unit-md flex flex-col'>
                <h2 className='text-2xl font-bold'>Participant details</h2>
                <div className='w-full h-[300px] flex items-center justify-center'>
                    <div className='flex flex-col items-center bg-white/60 rounded-medium p-unit-lg backdrop-blur-sm text-center'>
                        <span>
                            <BsPersonVcard className='text-default-400 text-6xl' />
                        </span>
                        <h3 className='text-xl font-bold mt-unit-md'>No participant selected</h3>
                        <p className='text-small text-foreground'>
                            Select a participant from the list to view the details.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const lastActivity = props.participant.lastSubmissions ? Object.values(props.participant.lastSubmissions).sort((a, b) => b - a)[0] : undefined;

    return (
        <div className='px-unit-md gap-unit-md flex flex-col'>
            <h2 className='text-2xl font-bold'>Participant details</h2>

            <div className='flex'>
                <Card className='bg-white'>
                    <CardBody>
                        <div className='flex flex-col gap-unit-lg'>

                            <div className='flex items-start gap-unit-md'>
                                <div>
                                    <AvatarFromId
                                        userId={props.participant.id}
                                        pixelSize={7}
                                    />
                                </div>
                                <div className=''>
                                    <div className='text-small text-foreground mb-unit-1'>
                                        Participant ID
                                    </div>
                                    <Snippet
                                        color='default'
                                        symbol=''
                                    >
                                        {props.participant.id}
                                    </Snippet>
                                </div>
                            </div>


                            <div className='flex gap-unit-md items-end'>
                                <div className=''>
                                    <div className='text-small text-foreground mb-unit-1 flex items-center gap-1'>
                                        <span className='text-default-400'><BsBoxArrowInRight /></span>
                                        Joined
                                    </div>
                                    <div>
                                        {(new Date(props.participant.enteredAt * 1000)).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className=''>
                                    <div className='text-small text-foreground mb-unit-1 flex items-center gap-1'>
                                        <span className='text-default-400'><BsActivity /></span>
                                        Last activity
                                    </div>
                                    <div>
                                        {lastActivity ? (new Date(lastActivity * 1000).toLocaleDateString()) : 'Never'}
                                    </div>
                                </div>
                                <span className='grow'></span>
                                <Chip
                                    size='lg'
                                    variant='flat'
                                    color={props.participant.studyStatus === 'active' ? 'success' : (props.participant.studyStatus === 'accountDeleted' ? 'danger' : 'default')}
                                >
                                    {props.participant.studyStatus}
                                </Chip>
                            </div>

                        </div>
                    </CardBody>
                </Card>
            </div>

            <Divider />
            <div>
                <h3 className='font-bold mb-unit-2'>Flags</h3>
            </div>
        </div>
    );
};

export default ParticipantDetails;
