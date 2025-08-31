'use client'

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Report, getReports } from '@/lib/data/reports';
import { Check, Copy, Download, List, Save } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { unparse } from 'papaparse';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ReportViewerClientProps {
    studyKey: string;
    reports: Array<Report>;
    totalCount: number;
    pageSize: number;
    reportKey?: string;
    pid?: string;
    from?: Date;
    until?: Date;
}

interface FlattenedReport {
    id: string;
    key: string;
    participantID: string;
    timestamp: number;
    responseID: string;
    [dataKey: string]: string | number | undefined;
}

const dataKeyPrefix = 'data_';

const formatRelativeTime = (unixSeconds: number): string => {
    const nowMs = Date.now();
    const thenMs = unixSeconds * 1000;
    const diff = Math.round((thenMs - nowMs) / 1000); // in seconds, negative if past

    const abs = Math.abs(diff);
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

    const divisors: Array<[Intl.RelativeTimeFormatUnit, number]> = [
        ['year', 60 * 60 * 24 * 365],
        ['month', 60 * 60 * 24 * 30],
        ['week', 60 * 60 * 24 * 7],
        ['day', 60 * 60 * 24],
        ['hour', 60 * 60],
        ['minute', 60],
        ['second', 1],
    ];

    for (const [unit, seconds] of divisors) {
        if (abs >= seconds || unit === 'second') {
            const value = Math.trunc(diff / seconds);
            return rtf.format(value, unit);
        }
    }
    return rtf.format(0, 'second');
}

const reservedColumns = [
    'id',
    'key',
    'participantID',
    'timestamp',
    'responseID',
]

const flattenReports = (reports: Array<Report>): { uniqueDataKeys: Set<string>, flattenedReports: Array<FlattenedReport> } => {
    const uniqueDataKeys = new Set<string>();
    const flattenedReports: Array<FlattenedReport> = [];
    for (const report of reports) {
        const flattenedReport: FlattenedReport = {
            id: report.id,
            key: report.key,
            participantID: report.participantID,
            timestamp: report.timestamp,
            responseID: report.responseID,
        };
        for (const data of report.data || []) {
            const dataKey = `${reservedColumns.includes(data.key) ? dataKeyPrefix : ''}${data.key}`;
            uniqueDataKeys.add(dataKey);
            switch (data.dtype) {
                case 'date':
                case 'float':
                    const n = Number(data.value);
                    flattenedReport[dataKey] = Number.isFinite(n) ? n : data.value;
                    break;
                case 'int':
                    const nInt = parseInt(data.value);
                    flattenedReport[dataKey] = Number.isFinite(nInt) ? nInt : data.value;
                    break;
                default:
                    flattenedReport[dataKey] = data.value;
                    break;
            }
        }
        flattenedReports.push(flattenedReport);
    }
    return { uniqueDataKeys, flattenedReports };
}

const ReportViewerClient: React.FC<ReportViewerClientProps> = (props) => {
    const [isMounted, setIsMounted] = React.useState(false);

    const [reports, setReports] = React.useState(props.reports || []);
    const [totalCount, setTotalCount] = React.useState(props.totalCount || 0);
    const [isPending, startTransition] = React.useTransition();
    const [copiedPID, setCopiedPID] = React.useState<string | null>(null);

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

    const onDownload = (format: 'csv' | 'json') => {
        startTransition(() => {
            const { uniqueDataKeys, flattenedReports } = flattenReports(reports);
            const dataKeysSorted = Array.from(uniqueDataKeys).sort((a, b) => a.localeCompare(b));
            const fixedHeaders = ['id', 'key', 'participantID', 'timestamp', 'responseID'];
            const headers = [...fixedHeaders, ...dataKeysSorted];

            try {
                if (format === 'csv') {
                    const rows = flattenedReports.map((r) => {
                        const base: Record<string, string | number | undefined> = {
                            id: r.id,
                            key: r.key,
                            participantID: r.participantID,
                            // Use ISO string instead of epoch for CSV
                            timestamp: new Date(r.timestamp * 1000).toISOString(),
                            responseID: r.responseID,
                        };
                        for (const k of dataKeysSorted) {
                            base[k] = r[k];
                        }
                        return base;
                    });
                    const csv = unparse({ fields: headers, data: rows });
                    const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${props.studyKey}_${props.reportKey}_reports.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    return;
                }

                // JSON export (flattened)
                const blob = new Blob([JSON.stringify({ reports: flattenedReports }, undefined, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${props.studyKey}_${props.reportKey}_reports.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (e) {
                console.error(e);
                toast.error('Failed to download reports');
            }
        });
    }

    const onLoadMore = () => {
        const page = Math.floor(reports.length / pageSize) + 1;
        startTransition(async () => {
            try {
                const resp = await getReports(
                    props.studyKey,
                    page,
                    props.reportKey,
                    props.pid,
                    props.from,
                    props.until,
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
            <div className='w-full p-4 h-full flex items-center justify-center'>
                <div className='text-center text-xl text-neutral-600'>
                    <div>
                        <List className='size-8 mb-2 mx-auto' />
                    </div>
                    <p>No reports found.</p>
                </div>
            </div>
        )
    }

    const { uniqueDataKeys, flattenedReports } = flattenReports(reports);
    const dataKeysSorted = Array.from(uniqueDataKeys).sort((a, b) => a.localeCompare(b));

    const displayLabelForDataKey = (key: string) => key.startsWith(`${dataKeyPrefix}`) ? key.slice(dataKeyPrefix.length) : key;

    const copyParticipantID = async (pid: string) => {
        try {
            await navigator.clipboard.writeText(pid);
            setCopiedPID(pid);
            toast.success('Participant ID copied');
            setTimeout(() => setCopiedPID(null), 1500);
        } catch {
            toast.error('Failed to copy Participant ID');
        }
    }

    return (
        <div className='h-full w-full'>
            <div className='overflow-y-scroll h-full pb-6'>

                <ScrollArea className='block h-full w-full'>
                    <div className='p-4 w-full'>
                        <Table className='w-max min-w-full'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='whitespace-nowrap'>Timestamp</TableHead>
                                    <TableHead className='whitespace-nowrap'>Participant ID</TableHead>
                                    <TableHead className='whitespace-nowrap'>Response ID</TableHead>
                                    {dataKeysSorted.map((key) => (
                                        <TableHead key={key} className='whitespace-nowrap'>
                                            {displayLabelForDataKey(key)}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {flattenedReports.map((report, i) => (
                                    <TableRow key={i}>
                                        <TableCell className='whitespace-nowrap py-0'>
                                            <div className='flex flex-col leading-tight'>
                                                <div className='text-neutral-900 font-medium'>{formatRelativeTime(report.timestamp)}</div>
                                                <div className='text-neutral-600 text-xs mt-0.5'>{new Date(report.timestamp * 1000).toLocaleString(
                                                    undefined, {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short',
                                                }
                                                )}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className='whitespace-nowrap py-0'>
                                            <div className='flex items-center gap-2'>
                                                <div className='font-mono max-w-[150px] overflow-x-auto whitespace-nowrap' title={report.participantID}>
                                                    {report.participantID}
                                                </div>
                                                <Button
                                                    variant={'ghost'}
                                                    size={'icon'}
                                                    className='h-6 w-6'
                                                    onClick={() => copyParticipantID(report.participantID)}
                                                >
                                                    {copiedPID === report.participantID ? (
                                                        <Check className='size-3 text-emerald-600' />
                                                    ) : (
                                                        <Copy className='size-3' />
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className='whitespace-nowrap'>
                                            <span className='font-mono'>{report.responseID}</span>
                                        </TableCell>
                                        {dataKeysSorted.map((key) => (
                                            <TableCell key={key} className='whitespace-nowrap'>
                                                {String(report[key] ?? '')}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <ScrollBar orientation='horizontal' />
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant={'link'}
                                        className='text-xs px-0 h-4'
                                    >
                                        <Save className='size-3 me-2' />
                                        Download current view
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuItem onClick={() => onDownload('csv')}>CSV</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => onDownload('json')}>JSON</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportViewerClient;
