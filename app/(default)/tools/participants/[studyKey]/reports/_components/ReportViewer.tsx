import React from 'react';
import ReportViewerClient from './ReportViewerClient';
import CogLoader from '@/components/CogLoader';
import ErrorAlert from '@/components/ErrorAlert';
import { getReports } from '@/lib/data/reports';
import { List } from 'lucide-react';

interface ReportViewerProps {
    studyKey: string;
    reportKey?: string;
    pid?: string;
    from?: Date;
    until?: Date;
}

const ReportViewer: React.FC<ReportViewerProps> = async (props) => {
    const pageSize = 100;

    if (!props.reportKey) {
        return (
            <div className='w-full p-4 h-full flex items-center justify-center'>
                <div className='text-center text-xl text-neutral-600'>
                    <div>
                        <List className='size-8 mb-2 mx-auto' />
                    </div>
                    <p>
                        Select a report key to view reports.
                    </p>
                </div>
            </div>
        )
    }

    const resp = await getReports(
        props.studyKey,
        1,
        props.reportKey,
        props.pid,
        props.from,
        props.until,
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
            pageSize={pageSize}
            totalCount={pagination?.totalCount || 0}
            reportKey={props.reportKey}
            pid={props.pid}
            from={props.from ? Math.floor(props.from.getTime() / 1000) : undefined}
            until={props.until ? Math.floor(props.until.getTime() / 1000) : undefined}
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
