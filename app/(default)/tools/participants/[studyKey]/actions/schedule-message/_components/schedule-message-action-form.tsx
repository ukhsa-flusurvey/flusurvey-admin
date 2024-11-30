'use client';

import LoadingButton from '@/components/LoadingButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { EmailTemplate } from '@/utils/server/types/messaging';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format } from 'date-fns';
import { Info } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Expression } from 'survey-engine/data_types';
import { z } from "zod"
import TaskRunner from './task-runner';
import { StudyEngine } from 'case-editor-tools/expression-utils/studyEngineExpressions';

const scheduleMessageActionSchema = z.object({
    studyKey: z.string().min(2).max(50),
    messageType: z.string().min(2, 'template type is required').max(50),
    scheduledFor: z.date(),
    participantIDs: z.array(z.string()).min(1),
})

interface ScheduleMessageActionFormProps {
    studyKey: string;
    availableStudyEmailTemplates?: Array<EmailTemplate>;
}

const dateToInputStr = (date: Date) => {
    return format(date, 'yyyy-MM-dd\'T\'HH:mm')
}


const ScheduleMessageActionForm: React.FC<ScheduleMessageActionFormProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();

    const [taskToRun, setTaskToRun] = useState<{
        participantID: string;
        rules: Expression[];
        studyKey: string;
        messageType: string;
    }[]>([])

    const form = useForm<z.infer<typeof scheduleMessageActionSchema>>({
        resolver: zodResolver(scheduleMessageActionSchema),
        defaultValues: {
            messageType: "",
            scheduledFor: new Date(),
            studyKey: props.studyKey,
            participantIDs: [],
        },
    })

    function onSubmit(values: z.infer<typeof scheduleMessageActionSchema>) {

        startTransition(() => {
            const rules = [StudyEngine.participantActions.messages.add(
                values.messageType,
                Math.floor(values.scheduledFor.getTime() / 1000),
            )]
            const newTasks = values.participantIDs.filter(
                id => id.length > 0
            ).map(participantID => {
                return {
                    participantID,
                    rules,
                    studyKey: values.studyKey,
                    messageType: values.messageType,
                }
            })
            setTaskToRun(prev => {
                return [...prev, ...newTasks]
            })
        })
    }

    return (
        <div className='p-4 space-y-4'>
            <h2 className='text-lg font-semibold mb-4'>Start action</h2>
            <Alert className="">
                <Info className="size-4" />
                <AlertDescription>
                    Use this form to schedule a message to be sent to the participants.

                </AlertDescription>
            </Alert>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="messageType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message type</FormLabel>
                                <FormControl>
                                    <Select name="messageType"
                                        onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a message type..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {!props.availableStudyEmailTemplates && <p className='text-center text-sm py-2 text-muted-foreground'> no templates available</p>}
                                            {props.availableStudyEmailTemplates?.map((template) => (
                                                <SelectItem key={template.messageType} value={template.messageType}>{template.messageType}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                </FormControl>
                                <FormDescription>
                                    Select the type of message to send.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="participantIDs"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Participant IDs</FormLabel>
                                <FormControl>
                                    <Textarea
                                        rows={8}
                                        name="participantIDs"
                                        value={field.value.join('\n')}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                            const value = e.target.value;
                                            const newValue = value.split('\n');
                                            field.onChange(newValue);
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter the participant IDs to send the message to.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="scheduledFor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Scheduled for</FormLabel>
                                <FormControl>
                                    <Input
                                        id='schedule-next-time'
                                        type='datetime-local'
                                        placeholder='enter next time...'
                                        value={dateToInputStr(field.value)}
                                        min={dateToInputStr(addDays(new Date(), -1))}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            field.onChange(new Date(value));
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter the date and time when the message should be sent.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />



                    <LoadingButton
                        type="submit"
                        isLoading={isPending}
                    >
                        Add message to participants
                    </LoadingButton>


                </form>
            </Form>

            {taskToRun.length > 0 && <div className='mt-4'>

                <h3 className='text-lg font-semibold mb-4'>Task runner</h3>
                <ul className='space-y-2'>
                    {taskToRun.map((task, index) => (
                        <li key={task.participantID + index.toFixed()}
                            className='flex gap-2 border border-border p-2 rounded-md'
                        >
                            {index + 1}
                            <TaskRunner
                                messageType={task.messageType}
                                participantID={task.participantID}
                                rules={task.rules}
                                studyKey={task.studyKey}
                            />
                        </li>
                    ))}
                </ul>
            </div>}


        </div>
    );
};

export default ScheduleMessageActionForm;
