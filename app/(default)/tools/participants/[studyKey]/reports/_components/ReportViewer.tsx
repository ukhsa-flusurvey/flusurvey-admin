import React from 'react';
import ReportViewerClient from './ReportViewerClient';
import CogLoader from '@/components/CogLoader';
import ErrorAlert from '@/components/ErrorAlert';
import { getReports } from '@/lib/data/reports';

interface ReportViewerProps {
    studyKey: string;
    filter?: string;
}

const ReportViewer: React.FC<ReportViewerProps> = async (props) => {
    const pageSize = 20;

    const resp = await getReports(
        props.studyKey,
        1,
        undefined,
        props.filter,
        pageSize,
    )

    const pagination = resp.pagination;
    const reports = resp.reports;

    console.log(reports);
    console.log(pagination)

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

    return (
        <ReportViewerClient
            studyKey={props.studyKey}
        />
    );
};

export default ReportViewer;

export const ReportViewerSkeleton = () => {
    return (
        <div className='flex w-full p-4'>
            <div className='w-full'>
                <CogLoader
                    label='Loading reports...'
                />
            </div>
        </div>
    );
}
