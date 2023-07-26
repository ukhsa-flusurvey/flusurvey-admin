'use client';

import { AuthAPIFetcher } from '@/utils/server/fetcher';
import { ParticipantState, pStateFromAPI } from '@/utils/server/types/participantState';
import React from 'react';
import useSWR from 'swr';
import ParticipantList from './ParticipantList';
import ParticipantDetails from './ParticipantDetails';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import InputForm from '@/components/inputs/Input';
import { set } from 'date-fns';

interface ParticipantManagerProps {
    studyKey: string
}

interface ParticipantStateResponse {
    itemCount: number;
    pageCount: number;
    page: number;
    pageSize: number;
    items: ParticipantState[];
}

const ParticipantManager: React.FC<ParticipantManagerProps> = ({
    studyKey
}) => {
    const [selectedParticipantId, setSelectedParticipantId] = React.useState<string | undefined>(undefined);
    const [selectedParticipant, setSelectedParticipant] = React.useState<ParticipantState | undefined>(undefined);
    const [page, setPage] = React.useState<number>(1);

    const [queryInput, setQueryInput] = React.useState<string>('');
    const [query, setQuery] = React.useState<string>('');

    const pageSize = 10;
    const { data, error, isLoading } = useSWR<ParticipantStateResponse>(`/api/case-management-api/v1/data/${studyKey}/participants?page=${page}&query=${encodeURIComponent(query)}&pageSize=${pageSize}`, AuthAPIFetcher)

    if (isLoading) return (<p>Loading...</p>)
    if (error) return (<p>Error: {error.message}</p>)
    if (!data || !data.items) return (<p>No data</p>)



    const pStates = data?.items.map(i => pStateFromAPI(i))
    console.log(pStates)
    console.log(data, error, isLoading)
    return (
        <div className='flex'>
            <div className='flex flex-col overflow-scroll h-full'>
                <div className='flex p-2 items-end mb-2'>
                    <InputForm
                        label='Filter'
                        value={queryInput}
                        onChange={(e) => {
                            setQueryInput(e.target.value)
                        }}
                    />
                    <button
                        className='bg-gray-100 h-10 ms-auto hover:bg-gray-200 p-2 rounded'
                        onClick={() => {
                            setQuery(queryInput)
                            setPage(1)
                        }}
                    >
                        Apply
                    </button>
                </div>
                <div className=''>
                    <ParticipantList participants={pStates}
                        selectedParticipantId={selectedParticipantId}
                        onSelectParticipant={(participantId) => {
                            setSelectedParticipantId(participantId)
                            setSelectedParticipant(pStates?.find(p => p.participantId === participantId))
                        }}
                    />
                </div>
                <div className='flex gap-4 justify-center items-center py-4'>
                    <button
                        className='bg-gray-100 hover:bg-gray-200 p-2 rounded'
                        onClick={() => {
                            if (page === 1) return
                            setPage(page - 1)
                        }
                        }>
                        <ChevronLeftIcon className='w-4 h-4' />
                    </button>
                    <span className='text-gray-400'>
                        {(page - 1) * pageSize + 1} - {Math.min(data.itemCount, page * pageSize)} of {data.itemCount}
                    </span>
                    <button
                        className='bg-gray-100 hover:bg-gray-200 p-2 rounded'
                        onClick={() => {
                            if (page === data.pageCount) return
                            setPage(page + 1)
                        }}>
                        <ChevronRightIcon className='w-4 h-4' />
                    </button>
                </div>
            </div>
            <div className='relative px-4 w-full'>
                <ParticipantDetails
                    participant={selectedParticipant}
                />
            </div>
        </div>
    );
};

export default ParticipantManager;
