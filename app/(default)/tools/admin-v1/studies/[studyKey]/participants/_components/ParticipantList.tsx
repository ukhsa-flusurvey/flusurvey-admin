'use client'

import { ParticipantState } from '@/utils/server/types/participantState';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { format } from 'date-fns';
import React from 'react';
import StatusBadge from './StatusBadge';


interface ParticipantListProps {
    participants: ParticipantState[];
    selectedParticipantId?: string;
    onSelectParticipant: (participantId: string) => void;
}


const getLastSubmission = (lastSubmissions?: { [key: string]: number }) => {
    if (!lastSubmissions) return <>
        None
    </>
    const lastSubmission = Object.values(lastSubmissions).sort((a, b) => b - a)[0]

    // format date form unix timestamp
    const date = new Date(lastSubmission * 1000)

    return <>
        {format(date, 'dd-MMM-yyyy')}
    </>
}

const ParticipantList: React.FC<ParticipantListProps> = (props) => {
    return (

        <div className="flex flex-col divide-y-2">
            {props.participants.map((p) => (
                <div
                    key={p.participantId}
                    className={clsx(
                        'flex w-full max-w-full',
                        'px-4 py-2',
                        'cursor-pointer',
                        {
                            'bg-gray-100 hover:bg-gray-100': props.selectedParticipantId === p.participantId,
                            'bg-white hover:bg-gray-50': props.selectedParticipantId !== p.participantId,
                        }
                    )}
                    onClick={() => props.onSelectParticipant(p.participantId)}>
                    <div className='overflow-auto'>
                        <div className='flex mb-2'>
                            <StatusBadge status={p.studyStatus} />
                        </div>
                        <div className='flex items-center justify-start w-full overflow-hidden text-ellipsis'>
                            <UserIcon className="block shrink-0 w-4 h-4 mr-2 text-gray-400" />
                            <span className=' font-mono'>{p.participantId}</span>
                        </div>
                        <div>
                            <span className='text-xs text-gray-400'>Last response: {getLastSubmission(p.lastSubmissions)}</span>
                        </div>
                    </div>
                    <div className='flex ms-auto flex-none ps-2 items-center'>
                        <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    </div>

                </div>
            ))}
        </div>
    );
};

export default ParticipantList;
