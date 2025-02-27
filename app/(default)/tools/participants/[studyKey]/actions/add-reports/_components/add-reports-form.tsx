'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { participantInfoSchema } from '../../schedule-message/_components/participant-info-uploader';
import { Expression } from 'survey-engine/data_types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StudyEngine } from 'case-editor-tools/expression-utils/studyEngineExpressions';
import { EmailTemplate } from '@/utils/server/types/messaging';
import { v4 as uuidv4 } from 'uuid';

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


    return (
        <p>AddReportsForm</p>
    );
};

export default AddReportsForm;
