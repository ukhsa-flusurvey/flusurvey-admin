'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';

interface AddPermissionDialogProps {
}

const AddPermissionDialog: React.FC<AddPermissionDialogProps> = (props) => {
    return (
        <Button className='mt-6'
            variant={'outline'}
        >
            <Plus className='size-4 me-2' />
            Add Permission
        </Button>
    );
};

export default AddPermissionDialog;
