import CogLoader from '@/components/CogLoader';
import React from 'react';
import { getParticipants } from '@/lib/data/participants';
import ErrorAlert from '@/components/ErrorAlert';
import { Skeleton } from '@/components/ui/skeleton';
import ParticipantClientList from './ParticipantClientList';

interface ParticipantsListProps {
    studyKey: string;
    filter?: string;
    page?: string;
    selectedParticipant?: string;
}

const ParticipantsList: React.FC<ParticipantsListProps> = async (props) => {
    const page = parseInt(props.page || '1');
    const filter = props.filter;
    const sort = encodeURIComponent('{ "enteredAt": 1 }');
    const resp = await getParticipants(props.studyKey, page, filter, sort, 20);

    const participants = resp.participants;
    const pagination = resp.pagination;
    const error = resp.error;


    if (error) {
        return <div className='w-[330px] relative border-r border-neutral-300 p-4'>
            <ErrorAlert
                title="Error loading participants"
                error={error || 'No participants found'}
            />
        </div>
    }

    if (!participants || participants.length === 0 || !pagination || pagination.totalCount === 0) {
        return <div className='w-[330px] relative border-r border-neutral-300 p-4'>
            <div className="flex py-6 flex-col justify-center items-center text-center">
                <p className="font-bold ">No participants</p>
                <p className="text-neutral-500 text-sm">
                    With the current filter, no participants were found
                </p>
            </div>
        </div>
    }

    return (
        <div className="h-full w-[330px] relative border-r border-neutral-300 ">
            <div className='px-4 absolute top-0 w-full text-sm font-semibold h-8 flex items-center justify-between border-b border-neutral-300 bg-slate-50'>
                Found {pagination.totalCount} participants
            </div>
            <ParticipantClientList
                studyKey={props.studyKey}
                filter={filter}
                sort={sort}
                initialParticipants={participants}
                selectedParticipant={props.selectedParticipant}
                totalParticipants={pagination.totalCount}
            />
        </div>
    );
};

export default ParticipantsList;

export const ParticipantListSkeleton: React.FC = () => {
    return (
        <div className="h-full w-[320px] relative border-r border-neutral-300 pt-4">
            <CogLoader
                label='Loading participants'
            />
            <div className="bg-slate-100 w-full h-12 absolute bottom-0 flex items-center justify-center border-t border-neutral-300">
                <Skeleton
                    className='h-4 w-4 bg-slate-400'
                />
                <Skeleton
                    className='h-4 w-24 mx-2 bg-slate-400'
                />
                <Skeleton
                    className='h-4 w-4 bg-slate-400'
                />
            </div>
        </div>

    );
}
