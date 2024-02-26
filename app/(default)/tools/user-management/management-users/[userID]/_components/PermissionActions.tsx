'use client';

import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import React, { useTransition } from 'react';

interface PermissionActionsProps {
    permission: any;
}

const PermissionActions: React.FC<PermissionActionsProps> = (props) => {
    const [isPending, startTransition] = useTransition();

    return (
        <div className='gap-2 flex justify-end'>
            <Button
                variant={'ghost'}
                size={'icon'}
                className='size-8'
            >
                <Pencil className='size-4' />
            </Button>
            <Button
                variant={'ghost'}
                size={'icon'}
                className='size-8'
            >
                <Trash2 className='size-4' />
            </Button>
        </div>
    );
};

export default PermissionActions;
