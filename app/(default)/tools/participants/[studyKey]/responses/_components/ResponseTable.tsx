import CogLoader from '@/components/CogLoader';
import React from 'react';
import ResponseTableClient from './ResponseTableClient';

interface ResponseTableProps {
    studyKey: string;
}

const ResponseTable: React.FC<ResponseTableProps> = async (props) => {
    // wait 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));

    // TODO construct filter and sort for later than and older than

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
