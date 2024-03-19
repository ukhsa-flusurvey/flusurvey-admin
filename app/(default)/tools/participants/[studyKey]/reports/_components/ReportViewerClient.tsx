'use client'

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Report, getReports } from '@/lib/data/reports';
import { Download, Save } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface ReportViewerClientProps {
    studyKey: string;
    filter?: string;
    reports: Array<Report>;
    totalCount: number;
    pageSize: number;
}

const ReportViewerClient: React.FC<ReportViewerClientProps> = (props) => {
    const [isMounted, setIsMounted] = React.useState(false);

    const [reports, setReports] = React.useState(props.reports || []);
    const [totalCount, setTotalCount] = React.useState(props.totalCount || 0);
    const [isPending, startTransition] = React.useTransition();

    const pageSize = props.pageSize || 20;

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        }
    }, []);

    if (!isMounted) {
        return null;
    }

    const onDownloadCurrentView = () => {
        startTransition(() => {
            const blob = new Blob([JSON.stringify({
                reports: reports,
            }, undefined, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${props.studyKey}_reports.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    const onLoadMore = () => {
        const page = Math.floor(reports.length / pageSize) + 1;
        startTransition(async () => {
            try {
                const resp = await getReports(
                    props.studyKey,
                    page,
                    undefined,
                    props.filter,
                    pageSize,
                );
                if (resp.error) {
                    toast.error('Failed to load more reports', {
                        description: resp.error
                    });
                    return;
                }
                if (resp.reports) {
                    setReports([...reports, ...resp.reports]);
                }
                if (resp.pagination) {
                    setTotalCount(resp.pagination.totalCount);
                }
            } catch (e) {
                console.error(e);
                toast.error('Failed to load more reports');
            }
        });
    }

    const hasMore = totalCount > reports.length;

    if (reports.length === 0) {
        return (
            <div>no reports</div>
        )
    }

    return (
        <div className='h-full w-full'>
            <div className='overflow-y-scroll h-full pb-6'>

                <ScrollArea className='block  h-full w-full'>
                    <ul className='p-4 space-y-4 w-full overflow-hidden'>
                        {
                            reports.map((report, i) => {
                                return (
                                    <li key={i}
                                        className='border overflow-hidden border-neutral-300 p-2 rounded-md bg-white space-y-2'
                                    >
                                        <div className='flex justify-between'>
                                            <Badge>
                                                {report.key}
                                            </Badge>
                                            {new Date(report.timestamp * 1000).toLocaleString()}
                                        </div>

                                        <div className='text-sm'>
                                            <p className='text-xs'>Participant ID</p>
                                            <p className='font-mono truncate'>{report.participantID}</p>
                                        </div>

                                        <div className='flex gap-2 flex-wrap'>
                                            {report.data?.map((d, i) => {
                                                return (
                                                    <div key={i}
                                                        className='flex gap-2 rounded-full border border-neutral-300 py-1 px-3 text-xs'
                                                    >
                                                        <span>{d.key}:</span>
                                                        <span className='font-bold'>{d.value}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>

                    <ScrollBar />
                </ScrollArea>


                <div className='h-6 w-full bg-slate-50 absolute bottom-0 left-0 border-t border-neutral-300'>
                    <div className='flex items-center justify-between px-4 h-full'>
                        <p className='text-neutral-500 text-xs '>
                            Showing reports:
                            <span className='ms-2'>
                                {reports.length} of {totalCount}
                            </span>
                        </p>

                        {hasMore && <Button
                            variant={'link'}
                            className='text-xs px-0 h-4'
                            onClick={onLoadMore}
                            disabled={isPending}
                        >
                            <Download className='size-3 me-2' />
                            {isPending ? 'Loading...' : 'Load more'}
                        </Button>}

                        <div className='flex gap-2 items-center max-h-6'>
                            <Button
                                variant={'link'}
                                className='text-xs px-0 h-4'
                                onClick={onDownloadCurrentView}
                            >
                                <Save className='size-3 me-2' />
                                Download current view
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportViewerClient;
