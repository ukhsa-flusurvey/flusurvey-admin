import React from 'react';
import ReportViewerClient from './ReportViewerClient';
import CogLoader from '@/components/CogLoader';
import ErrorAlert from '@/components/ErrorAlert';
import { getReports } from '@/lib/data/reports';
import { List } from 'lucide-react';

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

    if (!reports || reports.length === 0) {
        return (
            <div className='w-full p-4 h-full flex items-center justify-center'>
                <div className='text-center text-xl text-neutral-600'>
                    <div>
                        <List className='size-8 mb-2 mx-auto' />
                    </div>
                    <p>
                        No reports found.
                    </p>
                    <p className='text-sm mt-3'>
                        Check back later or try a different filter.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <ReportViewerClient
            studyKey={props.studyKey}
            reports={reports}
            filter={props.filter}
            pageSize={pageSize}
            totalCount={pagination?.totalCount || 0}
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
