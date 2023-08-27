'use client'

import { ParticipantState } from '@/utils/server/types/participantState';
import { Divider, Snippet } from '@nextui-org/react';
import React from 'react';
import { BsPerson, BsPersonVcard } from 'react-icons/bs';

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

    return (
        <div className='px-unit-md gap-unit-md flex flex-col'>
            <h2 className='text-2xl font-bold'>Participant details</h2>

            <div>
                <h3 className='font-bold mb-unit-2'>General</h3>
                <div className='flex gap-unit-sm'>
                    <div className='grow'>
                        <div className='text-small text-foreground mb-unit-1'>
                            Participant ID
                        </div>
                        <Snippet

                            color='default'
                            symbol=''
                        >
                            participantIDparticipantIDparticipantID
                        </Snippet>
                        <p>entered at todo</p>

                    </div>
                    <div>
                        <p>avatar</p>
                        <p>status</p>
                    </div>
                </div>

            </div>

            <Divider />
            <div>
                <h3 className='font-bold mb-unit-2'>Flags</h3>
            </div>
        </div>
    );
};

export default ParticipantDetails;
