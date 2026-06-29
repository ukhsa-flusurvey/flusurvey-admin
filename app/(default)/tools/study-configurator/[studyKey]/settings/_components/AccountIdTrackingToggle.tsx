'use client'

import { updateStudyTrackAccount } from '@/actions/study/updateStudyProps';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import React from 'react';
import { toast } from 'sonner';
import getErrorMessage from '@/utils/getErrorMessage';

interface AccountIdTrackingToggleProps {
    studyKey: string;
    trackAccount: boolean;
}

const AccountIdTrackingToggle: React.FC<AccountIdTrackingToggleProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();

    return (
        <div className='flex items-center'>
            <Switch
                id='accountIdTrackingToggle'
                name='accountIdTrackingToggle'
                checked={props.trackAccount}
                onCheckedChange={(checked) => {
                    startTransition(async () => {
                        try {
                            const resp = await updateStudyTrackAccount(props.studyKey, checked);
                            if (resp.error) {
                                toast.error(resp.error);
                                return;
                            }
                            toast.success('Account ID tracking updated');
                        } catch (error: unknown) {
                            toast.error('An error occurred', { description: getErrorMessage(error) });
                        }
                    });
                }}
                disabled={isPending}
            />
            <Label
                htmlFor='accountIdTrackingToggle'
                className='ml-2'
            >
                Track account ID for new participants ({props.trackAccount ? 'Yes' : 'No'})
            </Label>
        </div>
    );
};

export default AccountIdTrackingToggle;
