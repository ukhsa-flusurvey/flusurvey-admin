'use client'

import React from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import AvatarFromId from '@/components/AvatarFromID';
import { ParticipantState } from '@/utils/server/types/participantState';
import { Button } from '@/components/ui/button';
import { Activity, ChevronRight } from 'lucide-react';
import { shortenID } from '@/utils/shortenID';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ParticipantListItemProps {
    participant: ParticipantState;
    selected: boolean;
}

const getModifiedAt = (modifiedAt?: number, lastSubmissions?: { [key: string]: number }) => {
    if (!modifiedAt && !lastSubmissions) return <>
        None
    </>

    let value = modifiedAt;
    if (!value) {
        value = Object.values(lastSubmissions!).sort((a, b) => b - a)[0]
    }


    // format date form unix timestamp
    const date = new Date(value * 1000)

    return <>
        {format(date, 'dd-MMM-yyyy')}
    </>
}

const ParticipantListItem: React.FC<ParticipantListItemProps> = (props) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();


    const onSelectParticipant = (participantId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('selectedParticipant', participantId);

        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <li>
            <Button
                className={cn(
                    'py-3 h-auto flex gap-3 items-center w-full hover:bg-slate-200',
                    {
                        'bg-slate-300': props.selected
                    }
                )}
                variant='ghost'
                onClick={() => onSelectParticipant(props.participant.participantId)}
            >
                <AvatarFromId userId={props.participant.participantId}
                    pixelSize={3}
                />
                <div className='grow'>
                    <div className='text-start font-mono text-sm font-semibold'>
                        {shortenID(props.participant.participantId, 16)}
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className='text-neutral-700 text-xs grow flex items-center gap-1'>

                            <Activity className='size-3 text-neutral-400 me-1' />
                            {getModifiedAt(props.participant.modifiedAt, props.participant.lastSubmissions)}

                        </div>

                        <div className={cn(
                            'mx-2 text-xs px-2 bg-gray-200 rounded-sm',
                            {
                                'bg-green-200': props.participant.studyStatus === 'active',
                                'bg-red-200': props.participant.studyStatus === 'accountDeleted',
                                'bg-neutral-200': props.participant.studyStatus === 'temporary'
                            }

                        )}>
                            {props.participant.studyStatus}
                        </div>
                    </div>
                </div>

                <div>
                    <ChevronRight className="size-4" />
                </div>
            </Button>
        </li>
    );
};

export default ParticipantListItem;
