'use client'

import { deleteStudyCodeListEntry } from '@/actions/study/studyCodeListEntries';
import LoadingButton from '@/components/loading-button';
import { XIcon } from 'lucide-react';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

interface DeleteCodeListItemProps {
    studyKey: string;
    listKey: string;
    code: string;
}

const DeleteCodeListItem: React.FC<DeleteCodeListItemProps> = (props) => {
    const [isPending, startTransition] = useTransition();

    const deleteCodeListItem = () => {
        if (!confirm('Are you sure you want to delete this code list entry?')) {
            return;
        }
        startTransition(async () => {
            try {
                const resp = await deleteStudyCodeListEntry(props.studyKey, props.listKey, props.code);
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                toast.success('Code list entry deleted');
            } catch (error: unknown) {
                toast.error('Failed to delete code list entry', { description: (error as Error).message });
            }
        });
    }

    return (
        <LoadingButton
            variant={'ghost'}
            size='icon'
            isLoading={isPending}
            onClick={deleteCodeListItem}
        >
            <XIcon />
        </LoadingButton>
    );
};

export default DeleteCodeListItem;
