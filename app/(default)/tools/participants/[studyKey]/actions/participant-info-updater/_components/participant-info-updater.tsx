'use client';

import LoadingButton from '@/components/loading-button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Expression } from 'survey-engine/data_types';
import { z } from "zod"
import TaskRunner from '../../schedule-message/_components/task-runner';
import { StudyEngine } from 'case-editor-tools/expression-utils/studyEngineExpressions';
import ParticipantInfoUploader, { participantInfoSchema } from '../../schedule-message/_components/participant-info-uploader';
import { Switch } from '@/components/ui/switch';
import { v4 as uuidv4 } from 'uuid';


const updateParticipantInfoActionSchema = z.object({
    studyKey: z.string().min(2).max(50),
    useAsLinkingCode: z.boolean(),
    participantInfos: participantInfoSchema
})

interface ParticipantInfoUpdaterProps {
    studyKey: string;
}

const ParticipantInfoUpdater: React.FC<ParticipantInfoUpdaterProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();

    const [taskToRun, setTaskToRun] = useState<{
        participantID: string;
        rules: Expression[];
        studyKey: string;
        useAsLinkingCode: boolean;
        taskID: string;
    }[]>([])

    const form = useForm<z.infer<typeof updateParticipantInfoActionSchema>>({
        resolver: zodResolver(updateParticipantInfoActionSchema),
        defaultValues: {
            studyKey: props.studyKey,
            useAsLinkingCode: false,
            participantInfos: [],
        },
    })

    function onSubmit(values: z.infer<typeof updateParticipantInfoActionSchema>) {

        startTransition(() => {
            const newTasks: Array<{
                participantID: string;
                rules: Expression[];
                studyKey: string;
                useAsLinkingCode: boolean;
                taskID: string;
            }> = [];
            for (const pInfos of values.participantInfos) {
                const participantID = pInfos['participantID'];
                if (!participantID) {
                    continue;
                }

                const rules: Expression[] = []

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
                    participantID,
                    rules,
                    studyKey: values.studyKey,
                    useAsLinkingCode: values.useAsLinkingCode,
                    taskID: uuidv4(),
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
                    {'Update participant infos (flags or linking codes) using the CSV file to upload. The CSV file should have a header row with the column names. One of the columns must be "participantID". All other columns will be added as flags or linking codes to the participant. Empty cells will remove the participant\'s flag or linking code for the given key'}

                </AlertDescription>
            </Alert>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

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
                                messageType={task.useAsLinkingCode ? 'Update linking codes' : 'Update participant flags'}
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

export default ParticipantInfoUpdater;
