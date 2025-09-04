'use client';

import { saveStudyNotifications } from '@/actions/study/saveStudyNotifications';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { BeatLoader } from 'react-spinners';
import { toast } from 'sonner';
import getErrorMessage from '@/utils/getErrorMessage';

interface NotificationSubsListProps {
    studyKey: string;
    subscriptions: Array<{
        messageType: string;
        email: string;
    }>;
}

const NotificationSubsList: React.FC<NotificationSubsListProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();

    const messageTypes = props.subscriptions.map(s => s.messageType).filter((value, index, self) => self.indexOf(value) === index);

    const onRemove = (sub: { messageType: string; email: string }) => {
        if (!confirm('Are you sure you want to remove this subscription?')) {
            return;
        }

        const newSubs = props.subscriptions.filter(s => s.messageType !== sub.messageType || s.email !== sub.email);
        startTransition(async () => {
            try {
                const resp = await saveStudyNotifications(props.studyKey, newSubs);
                if (resp.error) {
                    toast.error(`Failed to remove subscription: ${resp.error}`);
                    return
                }
                toast.success('Subscription removed');
            } catch (error: unknown) {
                toast.error('Failed to remove subscription', { description: getErrorMessage(error) });
            }
        });

    }

    return (
        <>
            <BeatLoader loading={isPending} />
            <div className='mb-4 divide-y'>
                {messageTypes.map((mt) => {
                    return <div key={mt}
                        className='py-3'
                    >
                        <h4>
                            <span className='text-neutral-600 text-sm block'>Topic: </span>
                            <span className='font-bold'>{mt}</span>
                        </h4>
                        <ul className='px-6 divide-y'>
                            {props.subscriptions.filter(s => s.messageType === mt).map((sub) => {
                                return <li key={sub.email} className='flex items-center space-x-2 py-1'>
                                    <span>{sub.email}</span>
                                    <Button
                                        variant='ghost'
                                        size={'icon'}
                                        onClick={() => onRemove(sub)}
                                        disabled={isPending}
                                    >
                                        <Trash2 className='size-4' />

                                    </Button>
                                </li>
                            })}
                        </ul>
                    </div>
                }
                )}
            </div>
        </>
    );
};

export default NotificationSubsList;
