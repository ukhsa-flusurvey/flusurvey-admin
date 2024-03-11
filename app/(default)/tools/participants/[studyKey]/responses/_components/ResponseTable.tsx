import CogLoader from '@/components/CogLoader';
import React from 'react';
import ResponseTableClient from './ResponseTableClient';
import { ArrowUp, List } from 'lucide-react';
import { getResponses } from '@/lib/data/responses';
import ErrorAlert from '@/components/ErrorAlert';

interface ResponseTableProps {
    studyKey: string;
    searchParams?: {
        surveyKey?: string;
        laterThan?: number;
        earlierThan?: number;
        page?: string;
    }
}

const constructFilter = (laterThan?: number, earlierThan?: number) => {
    if (laterThan && earlierThan) {
        return `{"$and":[{"arrivedAt":{"$gt":${laterThan}}},{"arrivedAt":{"$lt":${earlierThan}}}]}`;
    }
    if (laterThan) {
        return `{"arrivedAt":{"$gt":${laterThan}}}`;
    }
    if (earlierThan) {
        return `{"arrivedAt":{"$lt":${earlierThan}}}`;
    }
    return undefined;
}

const ResponseTable: React.FC<ResponseTableProps> = async (props) => {
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

    const filter = constructFilter(props.searchParams.laterThan, props.searchParams.earlierThan);
    const sort = encodeURIComponent('{ "arrivedAt": 1 }');
    const pageSize = 20;
    const resp = await getResponses(
        props.studyKey,
        props.searchParams.surveyKey,
        1,
        filter,
        sort,
        pageSize,
        true
    );

    const error = resp.error;
    if (error) {
        return (
            <div className='flex p-4 justify-center w-full'>
                <div className='block w-full'>
                    <ErrorAlert
                        title='Failed to load responses'
                        error={error} />
                </div>
            </div>
        )
    }
    const responses = resp.responses || [];

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

    return (
        <ResponseTableClient
            studyKey={props.studyKey}
            surveyKey={props.searchParams.surveyKey}
            filter={filter}
            sort={sort}
            pageSize={pageSize}
            responses={responses}
            pagination={resp.pagination}
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
