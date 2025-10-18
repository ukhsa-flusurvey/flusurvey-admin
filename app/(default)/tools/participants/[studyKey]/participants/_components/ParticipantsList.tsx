import CogLoader from '@/components/CogLoader';
import React from 'react';
import { getParticipants } from '@/lib/data/participants';
import ErrorAlert from '@/components/ErrorAlert';
import ParticipantClientList from './ParticipantClientList';

interface ParticipantsListProps {
    studyKey: string;
    filter?: string;
    page?: string;
    selectedParticipant?: string;
}

const pageSize = 50;

const ParticipantsList: React.FC<ParticipantsListProps> = async (props) => {
    const page = parseInt(props.page || '1');
    const filter = props.filter;
    const sort = encodeURIComponent('{ "enteredAt": 1 }');
    const resp = await getParticipants(props.studyKey, page, filter, sort, pageSize);

    const participants = resp.participants;
    const pagination = resp.pagination;
    const error = resp.error;


    if (error) {
        return <div className='w-full relative p-4'>
            <ErrorAlert
                title="Error loading participants"
                error={error || 'No participants found'}
            />
        </div>
    }

    if (!participants || participants.length === 0 || !pagination || pagination.totalCount === 0) {
        return <div className='w-full relative p-4 '>
            <div className="flex py-6 flex-col justify-center items-center text-center h-full">
                <p className="font-bold ">No participants</p>
                <p className="text-neutral-500 text-sm">
                    With the current filter, no participants were found
                </p>
            </div>
        </div>
    }

    return (
        <div className="h-full w-full relative">
            <ParticipantClientList
                studyKey={props.studyKey}
                filter={filter}
                sort={sort}
                initialParticipants={participants}
                selectedParticipant={props.selectedParticipant}
                totalParticipants={pagination.totalCount}
                pageSize={pageSize}
            />
        </div>
    );
};

export default ParticipantsList;

export const ParticipantListSkeleton: React.FC = () => {
    return (
        <div className="h-full w-full relative pt-4 flex flex-col items-center justify-center">
            <CogLoader
                label='Loading participants'
            />
        </div>

    );
}
