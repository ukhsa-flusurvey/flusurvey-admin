'use client';

import { Button } from '@/components/ui/button';
import { ArrowUpRight, Copy, MoreVertical, Save, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import DeleteResponsesDialog from './DeleteResponsesDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination } from '@/utils/server/types/paginationInfo';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import LoadingButton from '@/components/LoadingButton';
import { getResponses } from '@/lib/data/responses';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useCopyToClipboard } from 'usehooks-ts';

interface ResponseTableClientProps {
    studyKey: string;
    surveyKey: string;
    filter?: string;
    sort?: string;
    pageSize?: number;
    responses?: Array<{
        [key: string]: number | string | boolean | Object
    }>;
    pagination?: Pagination;
}

const fixedCols = [
    'ID',
    "participantID",
    "version",
    "opened",
    "submitted",
    "language",
    "engineVersion",
    "session",
]


const ObjectValue = (props: { value: Object }) => {
    const [copiedText, copyToClipboard] = useCopyToClipboard();
    return (
        <div className='flex items-center'>
            {'<Object>'}
            <Button
                variant='link'
                size='icon'
                className='size-4 ms-2'
                onClick={() => {
                    copyToClipboard(JSON.stringify(props.value, null, 2));
                    toast.success('Copied to clipboard');
                }}
            >
                <Copy />
            </Button>
        </div>
    )
}

const printValue = (value: number | string | boolean | Object): string | React.ReactNode => {
    if (typeof value === 'object') {
        return <ObjectValue value={value} />
    }
    return value;
}

const printAsDate = (value: number) => {
    const date = new Date(value * 1000);
    return date.toLocaleString();
}

const ResponseTableClient: React.FC<ResponseTableClientProps> = (props) => {
    const [isMounted, setIsMounted] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    const [responses, setResponses] = React.useState(props.responses || []);
    const [totalResponses, setTotalResponses] = React.useState(props.pagination?.totalCount || 0);
    const [isPending, startTransition] = React.useTransition();

    const pageSize = props.pageSize || 20;

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        }
    }, []);

    useEffect(() => {
        setTotalResponses(props.pagination?.totalCount || 0);
    }, [props.pageSize, props.pagination?.totalCount]);

    if (!isMounted) {
        return null;
    }

    const onDownloadCurrentView = () => {
        console.log('Download current view');
    }

    const onLoadMore = () => {
        const page = Math.floor(responses.length / pageSize) + 1;
        startTransition(async () => {
            try {
                const resp = await getResponses(
                    props.studyKey,
                    props.surveyKey,
                    page,
                    props.filter,
                    props.sort,
                    pageSize,
                    true
                );
                if (resp.error) {
                    toast.error('Failed to load more responses', {
                        description: resp.error
                    });
                    return;
                }
                if (resp.responses) {
                    setResponses([...responses, ...resp.responses]);
                }
                if (resp.pagination) {
                    setTotalResponses(resp.pagination.totalCount);
                }
            } catch (e) {
                console.error(e);
                toast.error('Failed to load more responses');
            }
        });
    }

    const hasMore = totalResponses > responses.length;

    if (responses.length === 0) {
        return (
            <div>no responses</div>
        )
    }

    const allColumns = Object.keys(responses[0]);
    const columns = [...fixedCols, ...allColumns.filter(col => !fixedCols.includes(col))];

    return (
        <div className='h-full w-full'>
            <div className='overflow-y-scroll h-full pb-6'>
                <ScrollArea className='block pb-3'>
                    <Table className='text-xs border-2 border-neutral-300'>
                        <TableHeader>
                            <TableRow
                                className='bg-slate-100'
                            >
                                {columns.map((column, index) => {
                                    return (
                                        <TableHead key={index}
                                            className={cn('h-auto py-1 font-bold')}
                                        >
                                            {column}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {responses.map((resp, index) => {
                                return (
                                    <TableRow key={index}
                                        className='group'
                                    >
                                        {columns.map((column, index) => (
                                            <TableCell key={index}
                                                className={cn('h-auto py-1 bg-white',
                                                    'group-hover:bg-slate-50',
                                                    {
                                                        'bg-slate-50 group-hover:bg-slate-100': index % 2 === 0
                                                    },

                                                )}
                                            >
                                                {column === 'opened' || column === 'submitted' ? printAsDate(resp[column] as number) : printValue(resp[column])}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )

                            })}
                        </TableBody>

                    </Table>

                    <ScrollBar
                        orientation='horizontal'
                    />
                </ScrollArea>


                <div className='flex justify-center py-4 pb-8 w-full'>
                    {
                        hasMore ? <LoadingButton
                            isLoading={isPending}
                            variant={'default'}
                            onClick={onLoadMore}
                        >
                            Load more
                        </LoadingButton> : <p className='text-xs text-neutral-500'>
                            End of list
                        </p>
                    }
                </div>

            </div>

            <div className='h-6 w-full bg-slate-50 absolute bottom-0 left-0 border-t border-neutral-300'>
                <div className='flex items-center justify-between px-4 h-full'>
                    <p className='text-neutral-500 text-xs '>
                        Showing responses:
                        <span className='ms-2'>
                            {responses.length} of {totalResponses}
                        </span>
                    </p>

                    <div className='flex gap-2 items-center max-h-6'>
                        <Button
                            variant={'link'}
                            className='text-xs px-0 h-4'
                            onClick={onDownloadCurrentView}
                        >
                            <Save className='size-3 me-2' />
                            Download current view
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost"
                                    size='icon'
                                    className='size-4 px-0 flex items-center justify-center'

                                >
                                    <MoreVertical className="size-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align='end'
                                className="">
                                <DropdownMenuItem
                                    className='flex items-center gap-1 px-4 py-2 text-sm text-red-600'
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                >
                                    <span>
                                        <Trash2 className='size-4 me-2 opacity-60' />
                                    </span>
                                    <span>
                                        Delete responses by current filter
                                    </span>
                                    <span>
                                        <ArrowUpRight className='size-4 ms-2' />
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <DeleteResponsesDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}

                studyKey={props.studyKey}

                onPerformDelete={() => {
                    console.log('Perform delete');
                }}
            />

        </div>
    );
};

export default ResponseTableClient;
