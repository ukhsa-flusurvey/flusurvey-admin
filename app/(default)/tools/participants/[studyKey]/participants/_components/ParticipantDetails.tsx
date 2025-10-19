'use client';

import AvatarFromId from '@/components/AvatarFromID';
import { Activity, Bookmark, Calendar, FlagTriangleRight, LinkIcon, Mail, PencilIcon } from 'lucide-react';
import React, { useState } from 'react';
import CopyIdToClipboad from './CopyIdToClipboad';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ParticipantState } from '@/utils/server/types/participantState';
import { format } from 'date-fns';
import StatusBadge from './status-badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { participantStudyStatus } from './utils';
import { Spinner } from '@/components/ui/spinner';

interface ParticipantDetailsProps {
    studyKey: string;
    participant?: ParticipantState;
    onClose: () => void;
}

const StatusEditPopover = (props:
    {
        status: string,
        onStatusChange: (status: string) => void
    }) => {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant='ghost'
                    className='size-6 rounded-full'
                >
                    <PencilIcon className='size-3' />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
                <div className='flex flex-col gap-2'>
                    <Field>
                        <FieldLabel className='flex items-center gap-2'>
                            <span className='text-neutral-400'><FlagTriangleRight className='size-3' /></span>
                            Status
                        </FieldLabel>

                        <FieldContent>
                            <Select value={props.status} onValueChange={(value) => props.onStatusChange(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select status' />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(participantStudyStatus).map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FieldContent>
                    </Field>
                </div>
            </PopoverContent>
        </Popover>
    )
}


const ParticipantDetails: React.FC<ParticipantDetailsProps> = (props) => {
    const participant = props.participant;
    const lastModified = participant?.modifiedAt ? participant.modifiedAt : participant?.lastSubmissions ? Object.values(participant.lastSubmissions).sort((a, b) => b - a)[0] : undefined;

    const [isLoading, setIsLoading] = useState(true);

    const renderParticipantCard = () => {
        if (!participant) return null;

        return (<div className='flex flex-col gap-6'>
            <div className='flex items-start gap-4'>
                <div>
                    <AvatarFromId
                        userId={participant.participantId}
                        pixelSize={5}
                    />
                </div>
                <div className=''>
                    <div className='text-sm mb-1 font-semibold'>
                        Participant ID
                    </div>
                    <p
                        className='flex items-center gap-2'
                    >
                        <span className='font-mono text-xs truncate'>{participant.participantId}</span>
                        <CopyIdToClipboad
                            participantId={participant.participantId}
                        />
                    </p>
                </div>

                <div className='grow'></div>

                {isLoading && (
                    <div>
                        <Spinner className='size-6' />
                    </div>
                )}

            </div>

            <div className='flex gap-8 items-end'>
                <div className=''>
                    <div className='text-sm mb-1 flex items-center gap-2'>
                        <span className='text-neutral-400'><Calendar className='size-3' /></span>
                        Joined
                    </div>
                    <div className='font-mono text-sm font-semibold'>
                        {format(new Date(participant.enteredAt * 1000), 'dd-MMM-yyyy')}
                    </div>
                </div>

                <div className=''>
                    <div className='text-sm text-foreground mb-1 flex items-center gap-2'>
                        <span className='text-neutral-400'><Activity className='size-3' /></span>
                        Last modified
                    </div>
                    <div className='font-mono text-sm font-semibold'>
                        {lastModified ? format(new Date(lastModified * 1000), 'dd-MMM-yyyy') : 'Never'}
                    </div>
                </div>
                <span className='grow'></span>

                <div className='flex items-center gap-1'>
                    <StatusBadge status={participant.studyStatus} />
                    <StatusEditPopover status={participant.studyStatus}
                        onStatusChange={() => { }}
                    />
                </div>
            </div>
        </div>)
    }



    return (
        <Dialog
            open={props.participant !== undefined}
            onOpenChange={(open) => {
                if (!open) {
                    props.onClose();
                }
            }}
        >
            <DialogContent className='max-w-3xl  max-h-auto overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        Participant details
                    </DialogTitle>
                </DialogHeader>

                <div>
                    {renderParticipantCard()}
                </div>
                <Separator />
            </DialogContent>
        </Dialog>
    )
}

export default ParticipantDetails;

/*    if (!props.participantID) {
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

   const lastModified = participant.modifiedAt ? participant.modifiedAt : participant.lastSubmissions ? Object.values(participant.lastSubmissions).sort((a, b) => b - a)[0] : undefined;

   const participantCard = <Card className='p-6'>


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
               <TableRow key={key}
                   className='font-mono'
               >
                   <TableCell className='text-muted-foreground'>{key}</TableCell>
                   <TableCell>{value}</TableCell>
               </TableRow>
           ))}
       </TableBody>
   </Table>

   const linkingCodes = participant.linkingCodes ? Object.entries(participant.linkingCodes) : [];
   const linkingCodesTable = <Table>
       <TableHeader >
           <TableRow>
               <TableHead className='font-bold'>KEY</TableHead>
               <TableHead className='font-bold'>VALUE</TableHead>
           </TableRow>
       </TableHeader>
       <TableBody>
           {linkingCodes.length === 0 && (
               <TableRow>
                   <TableCell colSpan={2}>No linking codes</TableCell>
               </TableRow>
           )
           }
           {linkingCodes.map(([key, value]) => (
               <TableRow key={key}
                   className='font-mono'
               >
                   <TableCell className='text-muted-foreground'>{key}</TableCell>
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

           <div className='flex w-full'>
               <Card className='p-4'>
                   <h4 className='font-bold mb-2 flex items-center gap-2'>
                       <span className='text-neutral-400'><LinkIcon /></span>
                       Linking codes
                   </h4>
                   {linkingCodesTable}
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


*/
