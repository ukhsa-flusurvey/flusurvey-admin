'use client';

import React, { useEffect, useState } from 'react';
import ParticipantListItem from './ParticipantListItem';
import { ParticipantState } from '@/utils/server/types/participantState';
import Pagination from './Pagination';
import { Table, TableHead, TableRow, TableHeader, TableBody } from '@/components/ui/table';
import { Activity, Calendar, FlagTriangleRight, FileStack, UserRound, Tag, Mail } from 'lucide-react';
import ParticipantDetails from './ParticipantDetails';


interface ParticipantClientListProps {
    studyKey: string;
    initialParticipants: ParticipantState[];
    surveyKeys: string[];
    totalParticipants?: number;
    filter?: string;
    sort?: string;
    pageSize: number;
}

const ParticipantClientList: React.FC<ParticipantClientListProps> = (props) => {
    const [participants, setParticipants] = useState<ParticipantState[]>(props.initialParticipants);
    const totalParticipants = props.totalParticipants || 0;
    const [selectedParticipant, setSelectedParticipant] = useState<ParticipantState | undefined>(undefined);

    useEffect(() => {
        setParticipants(props.initialParticipants);
    }, [props.initialParticipants]);

    return (
        <div className="h-full w-full flex flex-col">

            <Table className=''>
                <TableHeader className='sticky top-0 z-10 bg-slate-50 border-b border-border font-semibold text-xs'>
                    <TableRow>
                        <TableHead className='p-2 h-auto w-12'>
                            <span className='sr-only'>Avatar</span>
                        </TableHead>
                        <TableHead className='p-2 h-auto w-[220px]'>
                            <span className='inline-flex items-center gap-1.5'>
                                <UserRound className='size-3' />
                                Participant ID
                            </span>
                        </TableHead>

                        <TableHead className='p-2 h-auto text-center'>
                            <span className='inline-flex items-center justify-center gap-1.5'>
                                <Calendar className='size-3' />
                                Joined
                            </span>
                        </TableHead>

                        <TableHead className='p-2 h-auto text-center'>
                            <span className='inline-flex items-center justify-center gap-1.5'>
                                <Activity className='size-3' />
                                Last modified
                            </span>
                        </TableHead>

                        <TableHead className='p-2 h-auto text-center'>
                            <span className='inline-flex items-center justify-center gap-1.5'>
                                <FlagTriangleRight className='size-3' />
                                Status
                            </span>
                        </TableHead>

                        <TableHead className='p-2 h-auto text-center'>
                            <span className='inline-flex items-center justify-center gap-1.5'>
                                <FileStack className='size-3' />
                                Surveys
                            </span>
                        </TableHead>

                        <TableHead className='p-2 h-auto text-center'>
                            <span className='inline-flex items-center justify-center gap-1.5'>
                                <Tag className='size-3' />
                                Flags & codes
                            </span>
                        </TableHead>

                        <TableHead className='p-2 h-auto text-center'>
                            <span className='inline-flex items-center justify-center gap-1.5'>
                                <Mail className='size-3' />
                                Messages
                            </span>
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody className="overflow-y-auto">
                    {participants.map((participant) => (
                        <ParticipantListItem
                            key={participant.participantId}
                            participant={participant}
                            selected={participant.participantId === selectedParticipant?.participantId}
                            onSelectParticipant={() => {
                                setSelectedParticipant(participant);
                            }}
                        />
                    ))}
                </TableBody>
            </Table>
            <ParticipantDetails
                participant={selectedParticipant}
                studyKey={props.studyKey}
                surveyKeys={props.surveyKeys}
                onClose={() => {
                    setSelectedParticipant(undefined);
                }}
                onChange={(participant) => {
                    setSelectedParticipant(participant);
                    setParticipants(prev => prev.map((p) => p.participantId === participant.participantId ? participant : p));
                }}
            />
            <div className='grow'></div>
            <Pagination limit={props.pageSize} total={totalParticipants} />
        </div>
    );
};

export default ParticipantClientList;
