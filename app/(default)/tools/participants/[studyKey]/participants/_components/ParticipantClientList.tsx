'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import React, { useEffect } from 'react';
import ParticipantListItem from './ParticipantListItem';
import { ParticipantState } from '@/utils/server/types/participantState';
import { Separator } from '@/components/ui/separator';
import LoadingButton from '@/components/loading-button';
import { getParticipants } from '@/lib/data/participants';
import { toast } from 'sonner';

interface ParticipantClientListProps {
    studyKey: string;
    initialParticipants: ParticipantState[];
    selectedParticipant?: string;
    totalParticipants?: number;
    filter?: string;
    sort?: string;
}

const pageSize = 10;

const ParticipantClientList: React.FC<ParticipantClientListProps> = (props) => {
    const [participants, setParticipants] = React.useState<ParticipantState[]>(props.initialParticipants);
    const [totalParticipants, setTotalParticipants] = React.useState<number>(props.totalParticipants || 0);
    const [isPending, startTransition] = React.useTransition();

    useEffect(() => {
        setTotalParticipants(props.totalParticipants || 0);
    }, [props.totalParticipants]);

    const onLoadMore = () => {
        const page = Math.floor(participants.length / pageSize) + 1;
        startTransition(async () => {
            try {
                const resp = await getParticipants(props.studyKey, page, props.filter, props.sort, pageSize);
                if (resp.error) {
                    toast.error('Failed to load more participants', {
                        description: resp.error
                    });
                    return;
                }
                if (resp.participants) {
                    setParticipants([...participants, ...resp.participants]);
                }
                if (resp.pagination) {
                    setTotalParticipants(resp.pagination.totalCount);
                }
            } catch (e) {
                console.error(e);
                toast.error('Failed to load more participants');
            }
        });
    }

    const hasMore = totalParticipants > participants.length;
    return (
        <ScrollArea
            className="h-full w-full overflow-y-auto pt-8 "
        >
            <ul className="divide-y p-1 w-full">
                {participants.map((participant) => (
                    <ParticipantListItem
                        key={participant.participantId}
                        participant={participant}
                        selected={participant.participantId === props.selectedParticipant}
                    />
                ))}
            </ul>
            <Separator />
            <div className='flex justify-center py-4 pb-8'>
                {
                    hasMore ? <LoadingButton
                        isLoading={isPending}
                        variant={'default'}
                        onClick={onLoadMore}
                    >
                        Load more
                    </LoadingButton> : <p className='text-xs text-neutral-500'>
                        End of list
                    </p>
                }
            </div>
            <ScrollBar />
        </ScrollArea>
    );
};

export default ParticipantClientList;
