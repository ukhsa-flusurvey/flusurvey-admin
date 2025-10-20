'use client'

import React from 'react';
import AvatarFromId from '@/components/AvatarFromID';
import { ParticipantState } from '@/utils/server/types/participantState';
import { Info } from 'lucide-react';
import { format } from 'date-fns';
import { TableCell, TableRow } from '@/components/ui/table';
import CopyIdToClipboad from './CopyIdToClipboad';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import StatusBadge from './status-badge';

interface ParticipantListItemProps {
    participant: ParticipantState;
    selected: boolean;
    onSelectParticipant: () => void;
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



const ParticipantListItem: React.FC<ParticipantListItemProps> = (props) => {

    return (
        <TableRow
            className='cursor-pointer text-xs'
            onClick={props.onSelectParticipant}>
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
                <span className='inline-flex items-center gap-2'>
                    <span>
                        {getModifiedAt(props.participant.modifiedAt, props.participant.lastSubmissions)}
                    </span>

                    <Tooltip>
                        <TooltipTrigger>
                            <span>
                                <Info className='size-3 text-muted-foreground' />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent side='left' align='start'
                            className='max-h-64 overflow-y-auto py-4'
                        >
                            <div className='text-start'>
                                <h3 className='text-xs font-semibold mb-2'>
                                    Last submission dates:
                                </h3>
                                <div className='rounded-md border border-border divide-y divide-border text-xs'>
                                    {Object.entries(props.participant?.lastSubmissions || {}).map(([surveyKey, timestamp]) => (
                                        <div key={surveyKey}
                                            className='flex items-center gap-2 justify-between w-full p-2'
                                        >
                                            <span className='font-mono font-bold'>{surveyKey}</span>
                                            <span>{format(new Date(timestamp * 1000), 'dd-MMM-yyyy HH:mm')}</span>
                                        </div>
                                    ))}
                                    {Object.entries(props.participant?.lastSubmissions || {}).length === 0 && (
                                        <div className='p-2 text-center'>
                                            No submissions yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </span>
            </TableCell>

            <TableCell className='p-2'>
                <div className='flex items-center justify-center'>
                    <StatusBadge status={props.participant.studyStatus} />
                </div>
            </TableCell>

            <TableCell className='p-2 text-center'>
                <div className='flex items-center justify-center gap-2'>
                    <span className='font-mono'>
                        {props.participant.assignedSurveys?.length || 0}
                    </span>

                    <Tooltip>
                        <TooltipTrigger>
                            <span>
                                <Info className='size-3 text-muted-foreground' />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent side='left' align='start'
                            className='max-h-64 overflow-y-auto py-4'
                        >
                            <div className='text-start'>
                                <h3 className='text-xs font-semibold mb-2'>
                                    Assigned surveys:
                                </h3>
                                <div className='rounded-md border border-border divide-y divide-border text-xs'>
                                    {props.participant?.assignedSurveys?.map((survey, index) => (
                                        <div key={index}
                                            className='flex items-center gap-2 justify-between w-full p-2'
                                        >
                                            <span className='font-mono font-bold'>{survey.surveyKey}</span>
                                            <span className='text-muted-foreground'>{survey.category}</span>
                                        </div>
                                    ))}
                                    {(props.participant?.assignedSurveys?.length || 0) === 0 && (
                                        <div className='p-2 text-center'>
                                            No assigned surveys currently.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </div>

            </TableCell>

            <TableCell className='p-2 text-center'>
                <div className='flex items-center justify-center gap-2'>
                    <span className='font-mono'>
                        {Object.keys(props.participant.flags || {}).length || 0}
                        &nbsp;+&nbsp;
                        {Object.keys(props.participant.linkingCodes || {}).length || 0}
                    </span>

                    <Tooltip>
                        <TooltipTrigger>
                            <span>
                                <Info className='size-3 text-muted-foreground' />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent side='left' align='start'
                            className='max-h-64 overflow-y-auto'
                        >
                            <div className='text-start space-y-4 py-2'>
                                <div>
                                    <h3 className='text-xs font-semibold mb-2'>
                                        Flags:
                                    </h3>
                                    <div className='rounded-md border border-border divide-y divide-border text-xs'>
                                        {Object.entries(props.participant.flags || {}).map(([key, value], index) => (
                                            <div key={index}
                                                className='flex items-center gap-2 justify-between w-full p-2'
                                            >
                                                <span className='font-mono font-bold'>{key}</span>
                                                <span className=''>{value}</span>
                                            </div>
                                        ))}
                                        {(Object.keys(props.participant.flags || {}).length || 0) === 0 && (
                                            <div className='p-2 text-center'>
                                                No flags.
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className='text-xs font-semibold mb-2'>
                                        Linking codes:
                                    </h3>
                                    <div className='rounded-md border border-border divide-y divide-border text-xs'>
                                        {Object.entries(props.participant.linkingCodes || {}).map(([key, value], index) => (
                                            <div key={index}
                                                className='flex items-center gap-2 justify-between w-full p-2'
                                            >
                                                <span className='font-mono font-bold'>{key}</span>
                                                <span className=''>{value}</span>
                                            </div>
                                        ))}
                                        {(Object.keys(props.participant.linkingCodes || {}).length || 0) === 0 && (
                                            <div className='p-2 text-center'>
                                                No linking codes.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </div>

            </TableCell>
            <TableCell className='p-2 text-center'>
                <div className='flex items-center justify-center gap-2'>
                    <span className='font-mono'>
                        {props.participant.messages?.length || 0}
                    </span>

                    <Tooltip>
                        <TooltipTrigger>
                            <span>
                                <Info className='size-3 text-muted-foreground' />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent side='left' align='start'
                            className='max-h-64 overflow-y-auto'
                        >
                            <div className='text-start space-y-4 py-2'>
                                <div>
                                    <h3 className='text-xs font-semibold mb-2'>
                                        Scheduled messages:
                                    </h3>
                                    <div className='rounded-md border border-border divide-y divide-border text-xs'>
                                        {props.participant.messages?.map((message, index) => (
                                            <div key={index}
                                                className='flex items-center gap-2 justify-between w-full p-2'
                                            >
                                                <span className='font-mono font-bold'>{message.type}</span>
                                                <span className=''>{format(new Date(message.scheduledFor * 1000), 'dd-MMM-yyyy HH:mm')}</span>
                                            </div>
                                        ))}
                                        {(props.participant.messages?.length || 0) === 0 && (
                                            <div className='p-2 text-center'>
                                                No messages.
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </TooltipContent>
                    </Tooltip>
                </div>

            </TableCell>
        </TableRow>
    );
};

export default ParticipantListItem;
