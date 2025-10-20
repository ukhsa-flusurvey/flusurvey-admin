'use client';

import AvatarFromId from '@/components/AvatarFromID';
import { Activity, Calendar } from 'lucide-react';
import React, { useState } from 'react';
import CopyIdToClipboad from './CopyIdToClipboad';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ParticipantState } from '@/utils/server/types/participantState';
import { format } from 'date-fns';
import StatusBadge from './status-badge';
import { Spinner } from '@/components/ui/spinner';
import { updateParticipant } from '@/lib/data/participants';
import { toast } from 'sonner';
import StatusEditPopover from './participant-editors/status-edit-popover';
import LinkingCodeSection from './participant-editors/linking-code-editor';
import ParticipantFlagSection from './participant-editors/flag-editor';


interface ParticipantDetailsProps {
    studyKey: string;
    participant?: ParticipantState;
    onClose: () => void;
    onChange: (participant: ParticipantState) => void;
}





const ParticipantDetails: React.FC<ParticipantDetailsProps> = (props) => {
    const participant = props.participant;
    const lastModified = participant?.modifiedAt ? participant.modifiedAt : participant?.lastSubmissions ? Object.values(participant.lastSubmissions).sort((a, b) => b - a)[0] : undefined;

    const [isLoading, setIsLoading] = useState(false);


    const onUpdateParticipant = async (participant: ParticipantState) => {
        setIsLoading(true);

        try {
            const resp = await updateParticipant(props.studyKey, participant);
            if (resp.error) {
                throw new Error(resp.error);
            }
            if (!resp.participant) {
                throw new Error('No participant returned');
            }
            toast.success('Participant updated');
            props.onChange(resp.participant);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update participant');
        } finally {
            setIsLoading(false);
        }
    }

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
                        onStatusChange={(value) => {
                            const newParticipant = {
                                ...participant,
                                studyStatus: value,
                            }
                            onUpdateParticipant(newParticipant);
                        }}
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
                    <DialogDescription>
                        View and edit state of the selected participant.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    {renderParticipantCard()}
                </div>
                <Separator />

                <ParticipantFlagSection
                    participant={participant}
                    isLoading={isLoading}
                    onChange={(participant) => {
                        onUpdateParticipant(participant);
                    }}
                />

                <LinkingCodeSection
                    participant={participant}
                    isLoading={isLoading}
                    onChange={(participant) => {
                        onUpdateParticipant(participant);
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}

export default ParticipantDetails;
