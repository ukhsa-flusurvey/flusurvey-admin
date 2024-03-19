import React from 'react';
import ParticipantFilesClient from './ParticipantFilesClient';
import CogLoader from '@/components/CogLoader';
import ErrorAlert from '@/components/ErrorAlert';
import { List } from 'lucide-react';
import { getFileInfos } from '@/lib/data/fileInfos';

interface ParticipantFilesProps {
    studyKey: string;
    filter?: string;
}

const ParticipantFiles: React.FC<ParticipantFilesProps> = async (props) => {
    const pageSize = 10;
    const resp = await getFileInfos(
        props.studyKey,
        1,
        props.filter,
        pageSize,
    );

    const fileInfos = resp.fileInfos;
    const error = resp.error;

    if (error) {
        return (
            <div className='flex w-full p-4'>
                <div className='w-full'>
                    <ErrorAlert
                        error={error}
                        title='Error loading reports'
                    />
                </div>
            </div>
        )
    }

    if (!fileInfos || fileInfos.length === 0) {
        return (
            <div className='w-full p-4 h-full flex items-center justify-center'>
                <div className='text-center text-xl text-neutral-600'>
                    <div>
                        <List className='size-8 mb-2 mx-auto' />
                    </div>
                    <p>
                        No file infos found.
                    </p>
                    <p className='text-sm mt-3'>
                        Check back later or try a different filter.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <ParticipantFilesClient
            studyKey={props.studyKey}
            filter={props.filter}
            fileInfos={fileInfos}
            pageSize={pageSize}
            totalCount={resp.pagination?.totalCount || 0}
        />
    );
};

export default ParticipantFiles;

export const ParticipantFilesSkeleton = () => {
    return (
        <div className='flex w-full p-4'>
            <div className='w-full'>
                <CogLoader
                    label='Loading file infos...'
                />
            </div>
        </div>
    );
};
