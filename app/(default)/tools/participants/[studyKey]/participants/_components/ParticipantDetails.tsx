import AvatarFromId from '@/components/AvatarFromID';
import CogLoader from '@/components/CogLoader';
import ErrorAlert from '@/components/ErrorAlert';

import { Card } from '@/components/ui/card';
import { getParticipantById } from '@/lib/data/participants';
import { shortenID } from '@/utils/shortenID';
import { Activity, ArrowDownLeft, AsteriskSquare, Bookmark, FileStack, Mail } from 'lucide-react';
import React from 'react';
import CopyIdToClipboad from './CopyIdToClipboad';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ParticipantDetailsProps {
    studyKey: string;
    participantID?: string;
}

const ParticipantDetails: React.FC<ParticipantDetailsProps> = async (props) => {
    if (!props.participantID) {
        return (
            <div className='flex gap-2 p-4'>
                <ArrowDownLeft className='size-6' />
                <p>Select a participant to view details</p>
            </div>
        );
    }

    const resp = await getParticipantById(props.studyKey, props.participantID);
    const participant = resp.participant;
    const error = resp.error;

    if (error || !participant) {
        return (
            <div className='p-4'>
                <ErrorAlert
                    title='Error loading participant details'
                    error={error || 'No participant found'}
                />
            </div>
        );
    }

    const lastActivity = participant.lastSubmissions ? Object.values(participant.lastSubmissions).sort((a, b) => b - a)[0] : undefined;

    const participantCard = <Card className='p-6'>
        <div className='flex flex-col gap-6'>
            <div className='flex items-start gap-4'>
                <div>
                    <AvatarFromId
                        userId={participant.participantId}
                        pixelSize={7}
                    />
                </div>
                <div className=''>
                    <div className='text-sm mb-1'>
                        Participant ID
                    </div>
                    <p
                        className='flex items-center gap-2'
                    >
                        {shortenID(participant.participantId, 32)}
                        <CopyIdToClipboad
                            participantId={participant.participantId}
                        />
                    </p>
                </div>
            </div>

            <div className='flex gap-4 items-end'>
                <div className=''>
                    <div className='text-sm mb-1 flex items-center gap-1'>
                        <span className='text-neutral-400'><AsteriskSquare className='size-4' /></span>
                        Joined
                    </div>
                    <div>
                        {(new Date(participant.enteredAt * 1000)).toLocaleDateString()}
                    </div>
                </div>
                <div className=''>
                    <div className='text-sm text-foreground mb-1 flex items-center gap-1'>
                        <span className='text-neutral-400'><Activity className='size-4' /></span>
                        Last activity
                    </div>
                    <div>
                        {lastActivity ? (new Date(lastActivity * 1000).toLocaleDateString()) : 'Never'}
                    </div>
                </div>
                <span className='grow'></span>

                <div className={cn(
                    'mx-2 text-xl px-4 py-1 bg-gray-200 rounded-sm font-semibold',
                    {
                        'bg-green-200': participant.studyStatus === 'active',
                        'bg-red-200': participant.studyStatus === 'accountDeleted',
                        'bg-neutral-200': participant.studyStatus === 'temporary'
                    }

                )}>
                    {participant.studyStatus}
                </div>
            </div>
        </div>

    </Card>

    const separator = <Separator className='bg-neutral-300' />

    const flags = participant.flags ? Object.entries(participant.flags) : [];
    const flagsTable = <Table>
        <TableHeader >
            <TableRow>
                <TableHead className='font-bold'>KEY</TableHead>
                <TableHead className='font-bold'>VALUE</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {flags.length === 0 && (
                <TableRow>
                    <TableCell colSpan={2}>No flags</TableCell>
                </TableRow>
            )
            }
            {flags.map(([key, value]) => (
                <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>

    const assignedSurveys = participant.assignedSurveys ? participant.assignedSurveys.map((s, index) => {
        return {
            key: index,
            ...s,
        }
    }) : [];

    const assignedSurveysTable = <Table>
        <TableHeader >
            <TableRow>
                <TableHead className='font-bold'>SURVEY KEY</TableHead>
                <TableHead className='font-bold'>CATEGORY</TableHead>
                <TableHead className='font-bold'>FROM</TableHead>
                <TableHead className='font-bold'>UNTIL</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {assignedSurveys.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4}>No assigned surveys</TableCell>
                </TableRow>
            )
            }
            {assignedSurveys.map((survey, index) => {
                let from = '';
                if (survey.validFrom) {
                    const date = new Date(survey.validFrom * 1000);
                    from = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                }

                let until = '';
                if (survey.validUntil) {
                    const date = new Date(survey.validUntil * 1000);
                    until = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                }

                return <TableRow key={index}>
                    <TableCell
                        className='font-bold font-mono'
                    >{survey.surveyKey}</TableCell>
                    <TableCell>{survey.category}</TableCell>
                    <TableCell>{from}</TableCell>
                    <TableCell>{until}</TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table>

    const lastSubmissions = participant.lastSubmissions ? Object.entries(participant.lastSubmissions) : [];
    const lastSubmissionsTable = <Table>
        <TableHeader >
            <TableRow>
                <TableHead className='font-bold'>SURVEY KEY</TableHead>
                <TableHead className='font-bold'>DATE</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {lastSubmissions.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4}>No responses</TableCell>
                </TableRow>
            )
            }
            {lastSubmissions.map((submission, index) => {
                let value = '';
                if (submission.length > 1) {
                    const date = new Date(submission[1] * 1000);
                    value = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                }

                return <TableRow key={index}>
                    <TableCell
                        className='font-bold font-mono'
                    >{submission[0]}</TableCell>
                    <TableCell>{value}</TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table>

    const scheduledMessages = participant.messages ? participant.messages : [];
    const scheduledMessagesTable = <Table>
        <TableHeader >
            <TableRow>
                <TableHead className='font-bold'>MESSAGE TYPE</TableHead>
                <TableHead className='font-bold'>DUE</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {scheduledMessages.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4}>No scheduled messages</TableCell>
                </TableRow>
            )
            }
            {scheduledMessages.map((message, index) => {
                const date = new Date(message.scheduledFor * 1000);
                const value = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;



                return <TableRow key={index}>
                    <TableCell
                        className='font-bold font-mono'
                    >{message.type}</TableCell>
                    <TableCell>{value}</TableCell>
                </TableRow>
            })}
        </TableBody>
    </Table>


    return (
        <div className='p-4 space-y-4'>
            <h3 className='text-xl font-bold'>Participant details</h3>

            {participantCard}

            {separator}

            <div className='flex w-full'>
                <Card className='p-4'>
                    <h4 className='font-bold mb-2 flex items-center gap-2'>
                        <span className='text-neutral-400'><Bookmark /></span>
                        Flags
                    </h4>
                    {flagsTable}
                </Card>
            </div>

            {separator}

            <div className='flex '>
                <Card className='p-4'>
                    <h4 className='font-bold mb-2 flex items-center gap-2'>
                        <span className='text-neutral-400'><FileStack /></span>
                        Assigned surveys
                    </h4>
                    {assignedSurveysTable}
                </Card>
            </div>

            {separator}

            <div className='flex '>
                <Card className='p-4'>
                    <h4 className='font-bold mb-2 flex items-center gap-2'>
                        <span className='text-neutral-400'><Activity /></span>
                        Last submissions
                    </h4>
                    {lastSubmissionsTable}
                </Card>
            </div>

            {separator}

            <div className='flex '>
                <Card className='p-4'>
                    <h4 className='font-bold mb-2 flex items-center gap-2'>
                        <span className='text-neutral-400'><Mail /></span>
                        Scheduled messages
                    </h4>
                    {scheduledMessagesTable}
                </Card>
            </div>
        </div>
    );
};

export default ParticipantDetails;

export const ParticipantDetailsSkeleton = () => {
    return (
        <div className='p-4 h-full'>
            <CogLoader
                label='Loading participant details...'
                className='h-full flex flex-col justify-center items-center'
            />
        </div>
    );
}
