import CogLoader from '@/components/CogLoader';
import React from 'react';
import ResponseTableClient from './ResponseTableClient';
import { ArrowUp, List } from 'lucide-react';

interface ResponseTableProps {
    studyKey: string;
    searchParams?: {
        surveyKey?: string;
        laterThan?: number;
        earlierThan?: number;
        page?: string;
    }
}

const ResponseTable: React.FC<ResponseTableProps> = async (props) => {


    // TODO construct filter and sort for later than and older than

    /*searchParams ?: {
        surveyKey?: string;
        laterThan?: number;
        earlierThan?: number;
        page?: string;
    }*/

    if (!props.searchParams || !props.searchParams.surveyKey) {
        return (
            <div className='w-flex p-4'>
                <div className='text-center text-sm text-neutral-600'>

                    <p>
                        <ArrowUp className='size-6 mb-2 mx-auto' />
                        Please select a survey key to view responses.
                    </p>
                </div>
            </div>
        );
    }

    const responses = [];

    if (responses.length === 0) {
        return (
            <div className='w-full p-4 h-full flex items-center justify-center'>
                <div className='text-center text-xl text-neutral-600'>
                    <div>
                        <List className='size-8 mb-2 mx-auto' />
                    </div>
                    <p>
                        No responses found.
                    </p>
                    <p className='text-sm mt-3'>
                        Check back later or try a different filter.
                    </p>
                </div>
            </div>
        );
    }

    // TODO: error
    // TODO: no responses
    return (
        <ResponseTableClient
            studyKey={props.studyKey}
        />
    );
};

export default ResponseTable;

export const ResponseTableSkeleton: React.FC = () => {
    return (
        <div className='w-full p-4'>
            <CogLoader
                label='Loading responses...'
            />
        </div>
    );
};
