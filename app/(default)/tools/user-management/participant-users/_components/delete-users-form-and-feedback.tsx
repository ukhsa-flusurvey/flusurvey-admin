'use client';

import { requestDeletionForParticipantUser } from '@/actions/user-management/participant-users';
import LoadingButton from '@/components/loading-button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';


interface DeletionTask {
    id: string;
    email: string;
    error?: string;
}

const DeleteUsersFormAndFeedback: React.FC = () => {
    const [isPending, startTransition] = React.useTransition();
    const [inputValue, setInputValue] = React.useState<string>('');

    const [deletionTasks, setDeletionTasks] = React.useState<DeletionTask[]>([]);
    const [finishedTasks, setFinishedTasks] = React.useState<string[]>([]);



    useEffect(() => {
        const jobToStart = deletionTasks.findIndex(task => !finishedTasks.includes(task.id));
        if (jobToStart < 0) {
            return;
        }

        const onDeletion = async (index: number) => {

            const task = deletionTasks[index];
            try {
                const resp = await requestDeletionForParticipantUser(task.email);

                // Update task with results
                setDeletionTasks(prev => {
                    const newTasks = [...prev];
                    newTasks[index] = {
                        ...newTasks[index],
                        error: resp.error || undefined
                    };
                    return newTasks;
                });
            } catch (error) {
                console.error(error);

                // Update task with error
                setDeletionTasks(prev => {
                    const newTasks = [...prev];
                    newTasks[index] = {
                        ...newTasks[index],
                        error: 'Failed to delete user'
                    };
                    return newTasks;
                });
            } finally {
                setFinishedTasks(prev => [...prev, task.id]);
            }

        }

        startTransition(async () => {
            await onDeletion(jobToStart);
        });
    }, [deletionTasks, finishedTasks])

    const hasAnyTaskInProgress = deletionTasks.some(task => !finishedTasks.includes(task.id));

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
                                    id: uuidv4(),
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
                    {deletionTasks.map((task) => {
                        if (!task || !task.email) {
                            return
                        }
                        const isLoading = !finishedTasks.includes(task.id);
                        const showSuccess = !isLoading && task.error === undefined;
                        const showError = !isLoading && task.error !== undefined;

                        return <div
                            key={task.id}
                            className={cn(
                                'space-y-2 border border-border p-2 rounded-md',
                                {
                                    'border-green-600': showSuccess,
                                    'border-red-600': showError,
                                }
                            )}>
                            <div className='flex items-center gap-2'>
                                {isLoading && <Loader2 className='animate-spin text-primary me-2' />}
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
