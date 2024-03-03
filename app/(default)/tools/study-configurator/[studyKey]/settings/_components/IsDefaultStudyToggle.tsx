'use client'

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { updateStudyIsDefault } from '@/lib/data/studyAPI';
import React from 'react';
import { toast } from 'sonner';

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
                        } catch (error) {
                            toast.error('An error occurred');

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
