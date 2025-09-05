'use client'

import { deleteStudyCodeListEntry } from '@/actions/study/studyCodeListEntries';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVerticalIcon } from 'lucide-react';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import getErrorMessage from '@/utils/getErrorMessage';

interface DeleteWholeCodeListProps {
    studyKey: string;
    listKey: string;
}

const DeleteWholeCodeList: React.FC<DeleteWholeCodeListProps> = (props) => {
    const [isPending, startTransition] = useTransition();

    const deleteCodeListItem = () => {
        if (!confirm('Are you sure you want to delete this code list completely?')) {
            return;
        }
        startTransition(async () => {
            try {
                const resp = await deleteStudyCodeListEntry(props.studyKey, props.listKey);
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                toast.success('Code list deleted');
            } catch (error: unknown) {
                toast.error('Failed to delete code list ', { description: getErrorMessage(error) });
            }
        });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <MoreVerticalIcon className='size-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem
                    disabled={isPending}
                    onClick={deleteCodeListItem}
                >Delete code list</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DeleteWholeCodeList;
