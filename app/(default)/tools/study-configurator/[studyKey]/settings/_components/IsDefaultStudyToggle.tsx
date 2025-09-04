'use client'

import { updateStudyIsDefault } from '@/actions/study/updateStudyProps';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import React from 'react';
import { toast } from 'sonner';
import getErrorMessage from '@/utils/getErrorMessage';


interface IsDefaultStudyToggleProps {
    studyKey: string;
    isDefaultStudy: boolean;
}

const IsDefaultStudyToggle: React.FC<IsDefaultStudyToggleProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();

    return (
        <div className='flex items-center'>
            <Switch
                id='isDefaultStudy'
                name='isDefaultStudy'
                checked={props.isDefaultStudy}
                onCheckedChange={(checked) => {
                    startTransition(async () => {
                        try {
                            const resp = await updateStudyIsDefault(props.studyKey, checked);
                            if (resp.error) {
                                toast.error(resp.error);
                                return;
                            }
                            toast.success('Study updated');
                        } catch (error: unknown) {
                            toast.error('An error occurred', { description: getErrorMessage(error) });
                        }
                    });
                }}
                disabled={isPending}
            />
            <Label
                htmlFor='isDefaultStudy'
                className='ml-2'
            >
                Default Study ({props.isDefaultStudy ? 'Yes' : 'No'})
            </Label>
        </div>
    );
};

export default IsDefaultStudyToggle;
