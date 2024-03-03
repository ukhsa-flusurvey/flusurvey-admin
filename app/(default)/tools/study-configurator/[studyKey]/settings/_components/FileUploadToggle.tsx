'use client'

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { updateStudyFileUploadConfig } from '@/lib/data/studyAPI';
import React from 'react';
import { toast } from 'sonner';

interface FileUploadToggleProps {
    studyKey: string;
    simplifiedFileUploadConfigValue: boolean;
}

const FileUploadToggle: React.FC<FileUploadToggleProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();

    return (
        <div className='flex items-center'>
            <Switch
                id='fileUploadToggle'
                name='fileUploadToggle'
                checked={props.simplifiedFileUploadConfigValue}

                onCheckedChange={(checked) => {
                    startTransition(async () => {
                        try {
                            const resp = await updateStudyFileUploadConfig(props.studyKey, checked);
                            if (resp.error) {
                                toast.error(resp.error);
                                return;
                            }
                            toast.success('File upload updated');
                        } catch (error) {
                            toast.error('An error occurred');
                        }
                    });
                }}
                disabled={isPending}
            />
            <Label
                htmlFor='fileUploadToggle'
                className='ml-2'
            >
                Participant can upload files ({props.simplifiedFileUploadConfigValue ? 'Yes' : 'No'})
            </Label>
        </div>
    );
};

export default FileUploadToggle;
