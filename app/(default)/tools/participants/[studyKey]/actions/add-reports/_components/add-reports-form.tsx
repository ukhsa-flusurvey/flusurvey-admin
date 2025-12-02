'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import ParticipantInfoUploader, { participantInfoSchema } from '../../schedule-message/_components/participant-info-uploader';
import { Expression } from 'survey-engine/data_types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StudyEngine } from 'case-editor-tools/expression-utils/studyEngineExpressions';
import { EmailTemplate } from '@/utils/server/types/messaging';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingButton from '@/components/loading-button';
import TaskRunner from '../../schedule-message/_components/task-runner';

interface AddReportsFormProps {
    studyKey: string;
    availableStudyEmailTemplates?: Array<EmailTemplate>;
}

const addReportsActionSchema = z.object({
    studyKey: z.string().min(2).max(50),
    reportKey: z.string().min(2).max(50),
    notifyParticipants: z.boolean(),
    notificationTemplateKey: z.string().min(1).max(50).optional(),
    participantInfos: participantInfoSchema
}).refine((data) => {
    // If notifyParticipants is true, notificationTemplateKey must be present and not empty
    if (data.notifyParticipants) {
        return data.notificationTemplateKey !== undefined &&
            data.notificationTemplateKey.trim() !== '';
    }
    return true;
},
    {
        message: "template is required when notifications is selected",
        path: ["notificationTemplateKey"], // Highlight this field in the error
    }
)

export const detectDataType = (value: string) => {
    // Empty check
    if (!value || value.trim() === '') {
        return "string";
    }

    // Check for integer
    if (/^-?\d+$/.test(value.trim())) {
        return "int";
    }

    // Check for float (includes scientific notation)
    if (/^-?\d*\.\d+$|^-?\d+\.\d*$|^-?\d+e[+-]?\d+$|^-?\d*\.\d+e[+-]?\d+$/.test(value.trim())) {
        return "float";
    }

    return "string";
}

const AddReportsForm: React.FC<AddReportsFormProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();

    const [taskToRun, setTaskToRun] = useState<{
        participantID: string;
        rules: Expression[];
        studyKey: string;
        taskID: string;
    }[]>([])

    const form = useForm<z.infer<typeof addReportsActionSchema>>({
        resolver: zodResolver(addReportsActionSchema),
        defaultValues: {
            studyKey: props.studyKey,
            reportKey: '',
            notifyParticipants: false,
            notificationTemplateKey: undefined,
            participantInfos: [],
        },
    })

    function onSubmit(values: z.infer<typeof addReportsActionSchema>) {
        startTransition(() => {
            const newTasks: Array<{
                participantID: string;
                rules: Expression[];
                studyKey: string;
                taskID: string;
            }> = [];
            for (const pInfos of values.participantInfos) {
                const participantID = pInfos['participantID'];
                if (!participantID) {
                    continue;
                }

                const rules: Expression[] = []

                // init report
                rules.push(StudyEngine.participantActions.reports.init(values.reportKey));

                for (const key in pInfos) {
                    if (key === 'participantID') {
                        continue;
                    }
                    const pInfoVal = pInfos[key];
                    const pInfoType = detectDataType(pInfoVal);
                    rules.push(StudyEngine.participantActions.reports.updateData(values.reportKey, key, pInfoVal, pInfoType));
                }

                if (values.notifyParticipants && values.notificationTemplateKey) {
                    rules.push(StudyEngine.participantActions.messages.add(values.notificationTemplateKey, StudyEngine.timestampWithOffset({
                        days: 0,
                    })));
                }

                newTasks.push({
                    participantID,
                    rules,
                    studyKey: values.studyKey,
                    taskID: uuidv4(),
                })
            }
            setTaskToRun(prev => {
                return [...newTasks, ...prev]
            })
        })
    }

    const notifyParticipants = form.watch("notifyParticipants");


    return (
        <div className='p-4 space-y-4'>
            <h2 className='text-lg font-semibold mb-4'>Add report to participants</h2>
            <Alert className="">
                <Info className="size-4" />
                <AlertDescription>
                    {'Generate a new report with payload data from the CSV file for participants. The CSV file should have a header row with the column names. One of the columns must be "participantID". All other columns will be added as data payload of the report. Optionally, you can generate a new notification email that would be scheduled for sending as soon as possible.'}

                </AlertDescription>
            </Alert>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="reportKey"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Report key</FormLabel>
                                <FormControl>
                                    <Input
                                        id='report-key'
                                        type='text'
                                        placeholder='report_identifier...'
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Define the report type / category / id. These keys are used to fetch / filter reports.
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
                                        values={field.value || []}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="notifyParticipants"
                        render={({ field }) => (
                            <FormItem>
                                <div className='flex items-center gap-2'>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />

                                    </FormControl>
                                    <FormLabel className='cursor-pointer font-normal'>
                                        Notify participants per email
                                    </FormLabel>
                                </div>
                                <FormDescription>
                                    Toggle if the participants should be notified via email.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {notifyParticipants && <FormField
                        control={form.control}
                        name="notificationTemplateKey"
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
                                    Which message template to use.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}

                    />}

                    <LoadingButton
                        type="submit"
                        isLoading={isPending}
                    >
                        Run action to update participant infos
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
                                messageType={'Report creation'}
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

export default AddReportsForm;
