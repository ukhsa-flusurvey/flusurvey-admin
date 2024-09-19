'use client';

import { requestDeletionForParticipantUser } from '@/actions/user-management/participant-users';
import LoadingButton from '@/components/LoadingButton';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React, { use, useEffect } from 'react';

interface DeleteUsersFormAndFeedbackProps {
}

interface DeletionTask {
    email: string;
    error?: string;
    inProgress: boolean;
    ready?: boolean;
}

const DeleteUsersFormAndFeedback: React.FC<DeleteUsersFormAndFeedbackProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();
    const [inputValue, setInputValue] = React.useState<string>('');

    const [deletionTasks, setDeletionTasks] = React.useState<DeletionTask[]>([]);



    useEffect(() => {
        const jobToStart = deletionTasks.findIndex(task => !task.inProgress && !task.ready);
        if (jobToStart < 0) {
            return;
        }

        const onDeletion = async (task: DeletionTask, index: number) => {
            if (task.inProgress || task.ready) {
                return;
            }
            setDeletionTasks(prev => {
                const newTasks = [...prev];
                newTasks[index].inProgress = true;
                return newTasks;
            });
            try {
                const resp = await requestDeletionForParticipantUser(task.email);
                task.ready = true;
                task.inProgress = false;
                if (resp.error) {
                    task.error = resp.error;
                }
                const newTasks = [...deletionTasks];
                newTasks[index] = task;
                setDeletionTasks(newTasks);
            } catch (error) {
                console.error(error);
                task.ready = true;
                task.inProgress = false;
                task.error = 'Failed to delete user';
                const newTasks = [...deletionTasks];
                newTasks[index] = task;
                setDeletionTasks(newTasks);
            }
        }

        onDeletion(deletionTasks[jobToStart], jobToStart);


    }, [deletionTasks])

    const hasAnyTaskInProgress = deletionTasks.some(task => task.inProgress);

    return (
        <div
            className='flex gap-6 w-full'
        >
            <div>
                <Card
                    className='p-4 space-y-4 min-w-72'
                    variant={"opaque"}>
                    <h2 className='text-lg font-semibold mb-4'>Delete Users</h2>

                    <div className='space-y-1.5'>
                        <Label
                            htmlFor='input-value'
                        >
                            Email addresses
                        </Label>
                        <Textarea
                            id='input-value'
                            name='input-value'
                            placeholder='Enter email addresses of users to delete, one per line.'
                            value={inputValue}
                            disabled={hasAnyTaskInProgress || isPending}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                            }}
                        />
                        <p className='text-xs text-muted-foreground'>
                            Enter the email addresses of the users to delete. One per line.
                        </p>
                    </div>


                    <LoadingButton
                        variant={'default'}
                        isLoading={isPending || hasAnyTaskInProgress}
                        disabled={!inputValue}
                        onClick={() => {
                            if (!confirm('Are you sure you want to delete these users? This action cannot be undone.')) {
                                return;
                            }
                            const emails = inputValue.split('\n').map(email => email.trim().toLowerCase());
                            const uniqueEmails = Array.from(new Set(emails));
                            const tasks: DeletionTask[] = uniqueEmails.map(email => {
                                return {
                                    email: email.trim().toLowerCase(),
                                    inProgress: false,
                                    error: undefined
                                }
                            });
                            setDeletionTasks(tasks);
                            setInputValue('');
                        }}
                    >
                        Delete Users
                    </LoadingButton>
                </Card>
            </div>

            <Card variant={"opaque"}
                className='p-4 grow'
            >
                <h2 className='text-lg font-semibold mb-4'>Deletion Results</h2>
                <div className='flex flex-wrap gap-4'>
                    {!deletionTasks.length && <p className='text-sm text-muted-foreground'>
                        Use the form on the left to start deleting users.
                    </p>}
                    {deletionTasks.map((task, index) => {
                        if (!task || !task.email) {
                            return
                        }
                        const showSuccess = task.ready && task.error === undefined;
                        const showError = task.ready && task.error !== undefined;

                        return <div
                            key={task.email}
                            className={cn(
                                'space-y-2 border border-border p-2 rounded-md',
                                {
                                    'border-green-600': showSuccess,
                                    'border-red-600': showError,
                                }
                            )}>
                            <div className='flex items-center gap-2'>
                                {!task.ready && <Loader2 className='animate-spin text-primary me-2' />}
                                <p className='font-semibold text-sm'>
                                    {task.email}
                                </p>
                            </div>

                            {showError && <p className='text-red-600 text-xs'>
                                {task.error}
                            </p>}
                            {showSuccess && <p className='text-green-600 text-xs'>
                                User deleted
                            </p>}



                        </div>
                    })}
                </div>

            </Card>
        </div>


    );
};

export default DeleteUsersFormAndFeedback;
