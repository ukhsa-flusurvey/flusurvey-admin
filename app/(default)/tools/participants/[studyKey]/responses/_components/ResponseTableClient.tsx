'use client';

import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowUpSquare, MoreVertical, Save, Trash2 } from 'lucide-react';
import React from 'react';
import DeleteResponsesDialog from './DeleteResponsesDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ResponseTableClientProps {
    studyKey: string;
}

const ResponseTableClient: React.FC<ResponseTableClientProps> = (props) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    const onDownloadCurrentView = () => {
        console.log('Download current view');
    }

    return (
        <div className='h-full w-full relative'>




            <div className='h-6 w-full bg-slate-50 absolute bottom-0 left-0 border-t border-neutral-300'>
                <div className='flex items-center justify-between px-4 h-full'>
                    <p className='text-neutral-500 text-xs '>
                        Showing responses:
                        <span className='ms-2'>
                            0 of 0
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
