'use client';

import LoadingButton from '@/components/loading-button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import ParticipantInfoUploader, { participantInfoSchema } from './participant-info-uploader';
import { Switch } from '@/components/ui/switch';
import { v4 as uuidv4 } from 'uuid';


const scheduleMessageActionSchema = z.object({
    studyKey: z.string().min(2).max(50),
    messageType: z.string().min(2, 'template type is required').max(50),
    scheduledFor: z.date(),
    useAsLinkingCode: z.boolean(),
    participantInfos: participantInfoSchema
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
        taskID: string;
    }[]>([])

    const form = useForm<z.infer<typeof scheduleMessageActionSchema>>({
        resolver: zodResolver(scheduleMessageActionSchema),
        defaultValues: {
            messageType: "",
            scheduledFor: new Date(),
            studyKey: props.studyKey,
            useAsLinkingCode: false,
            participantInfos: [],
        },
    })

    function onSubmit(values: z.infer<typeof scheduleMessageActionSchema>) {

        startTransition(() => {
            const newTasks: Array<{
                participantID: string;
                rules: Expression[];
                studyKey: string;
                messageType: string;
                taskID: string;
            }> = [];
            for (const pInfos of values.participantInfos) {
                const participantID = pInfos['participantID'];
                if (!participantID) {
                    continue;
                }

                const rules = [
                    StudyEngine.participantActions.messages.add(
                        values.messageType,
                        Math.floor(values.scheduledFor.getTime() / 1000),
                    ),
                ]

                for (const key in pInfos) {
                    if (key === 'participantID') {
                        continue;
                    }
                    const pInfoVal = pInfos[key];
                    let updateExpression: Expression;
                    if (values.useAsLinkingCode) {
                        if (!pInfoVal) {
                            updateExpression = StudyEngine.participantActions.linkingCodes.delete(key);
                        } else {
                            updateExpression = StudyEngine.participantActions.linkingCodes.set(key, pInfoVal);
                        }
                    } else {
                        if (!pInfoVal) {
                            updateExpression = StudyEngine.participantActions.removeFlag(key)
                        } else {
                            updateExpression = StudyEngine.participantActions.updateFlag(
                                key,
                                pInfoVal
                            )
                        }
                    }
                    rules.push(updateExpression);
                }

                newTasks.push({
                    taskID: uuidv4(),
                    participantID,
                    rules,
                    studyKey: values.studyKey,
                    messageType: values.messageType,
                })
            }
            setTaskToRun(prev => {
                return [...newTasks, ...prev]
            })
        })
    }

    return (
        <div className='p-4 space-y-4'>
            <h2 className='text-lg font-semibold mb-4'>Start action</h2>
            <Alert className="">
                <Info className="size-4" />
                <AlertDescription>
                    {'Use this form to schedule a message to be sent to the participants. Use the CSV file to upload the participant IDs and their information. The CSV file should have a header row with the column names. One of the columns must be "participantID". All other columns will be added as flags or linking codes to the participant. Empty cells will remove the participant\'s flag or linking code for the given key'}

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

                    <FormField
                        control={form.control}
                        name="useAsLinkingCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='cursor-pointer'>
                                    Info target mode
                                </FormLabel>
                                <div className='flex items-center gap-2'>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />

                                    </FormControl>
                                    <FormLabel className='cursor-pointer font-normal'>
                                        Use participant infos as {field.value ? 'linking code' : 'participant flags'}
                                    </FormLabel>
                                </div>
                                <FormDescription>
                                    Toggle if the additional columns should be used as linking code or participant flags.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="participantInfos"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ParticipantInfoUploader
                                        values={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
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
                        <li key={task.taskID}
                            className='flex gap-2 border border-border p-2 rounded-md'
                        >
                            {taskToRun.length - index}
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
