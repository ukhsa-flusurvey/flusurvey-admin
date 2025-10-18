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
import { TableCell, TableRow } from '@/components/ui/table';
import CopyIdToClipboad from './CopyIdToClipboad';
import { participantStudyStatus } from './utils';

interface ParticipantListItemProps {
    participant: ParticipantState;
    selected: boolean;
}

const getModifiedAt = (modifiedAt?: number, lastSubmissions?: { [key: string]: number }) => {
    if (!modifiedAt && !lastSubmissions) return <>
        Never
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

const StatusBadge = ({ status }: { status: string }) => {
    const statusLabel = participantStudyStatus[status as keyof typeof participantStudyStatus]?.label || status;
    const statusBgColor = participantStudyStatus[status as keyof typeof participantStudyStatus]?.bgColor || participantStudyStatus.other.bgColor;
    const statusBorderColor = participantStudyStatus[status as keyof typeof participantStudyStatus]?.borderColor || participantStudyStatus.other.borderColor;
    return (
        <div className={cn('px-2 py-0.5 rounded-full text-xs border w-fit flex items-center gap-1 bg-white', statusBorderColor)}>
            <span className={cn('size-2 rounded-full inline-block bg-white', statusBgColor)}></span>
            <span className='text-[10px] font-semibold uppercase'>{statusLabel}</span>
        </div>
    )
}

const ParticipantListItem: React.FC<ParticipantListItemProps> = (props) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();


    const onSelectParticipant = (participantId: string) => {
        alert(participantId);
        const params = new URLSearchParams(searchParams);
        params.set('selectedParticipant', participantId);

        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <TableRow
            className='cursor-pointer text-xs'
            onClick={() => onSelectParticipant(props.participant.participantId)}>
            <TableCell className='p-2 flex items-center justify-center'>
                <AvatarFromId userId={props.participant.participantId}
                    pixelSize={2}
                />
            </TableCell>
            <TableCell className='p-2 max-w-[200px]'>
                <div className='flex items-center gap-2 max-w-[200px] overflow-x-auto'>
                    <span className='font-mono text-xs truncate'>{props.participant.participantId}</span>
                    <CopyIdToClipboad
                        participantId={props.participant.participantId}
                    />
                </div>
            </TableCell>

            <TableCell className='p-2 text-center'>
                {format(new Date(props.participant.enteredAt * 1000), 'dd-MMM-yyyy')}
            </TableCell>

            <TableCell className='p-2 text-center'>
                {getModifiedAt(props.participant.modifiedAt, props.participant.lastSubmissions)}
            </TableCell>

            <TableCell className='p-2'>
                <StatusBadge status={props.participant.studyStatus} />
            </TableCell>
        </TableRow>
    );
    /*           />
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
   );*/
};

export default ParticipantListItem;
