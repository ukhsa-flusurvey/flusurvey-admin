'use client';

import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowUpSquare, MoreVertical, Save, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import DeleteResponsesDialog from './DeleteResponsesDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination } from '@/utils/server/types/paginationInfo';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import LoadingButton from '@/components/LoadingButton';
import { getResponses } from '@/lib/data/responses';
import { toast } from 'sonner';

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

const ResponseTableClient: React.FC<ResponseTableClientProps> = (props) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    const [responses, setResponses] = React.useState(props.responses || []);
    const [totalResponses, setTotalResponses] = React.useState(props.pagination?.totalCount || 0);
    const [isPending, startTransition] = React.useTransition();

    const pageSize = props.pageSize || 20;

    useEffect(() => {
        setTotalResponses(props.pagination?.totalCount || 0);
    }, [props.pageSize, props.pagination?.totalCount]);

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

    return (
        <div className='h-full w-full relative'>
            <ScrollArea
                className="h-full w-full overflow-y-auto pb-6 "
            >



                <div className='flex justify-center py-4 pb-8'>
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

                <ScrollBar />
            </ScrollArea>


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
