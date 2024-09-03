'use client';

import Filepicker from '@/components/inputs/Filepicker';

import React, { useState, useTransition } from 'react';
import { BsBracesAsterisk, BsPlay, BsPlayBtn } from 'react-icons/bs';
import { Expression, isExpression } from 'survey-engine/data_types';
import { runCustomRules } from '../../../../../../actions/study/runCustomRules';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import LoadingButton from '@/components/LoadingButton';


interface StudyActionsCardProps {
    studyKey: string;
}

const checkIfValidCustomStudyRules = (rules: any): boolean => {
    if (!Array.isArray(rules)) {
        return false;
    }
    for (const rule of rules) {
        if (!isExpression(rule)) {
            return false;
        }
    }
    return true
}

const StudyActionsCard: React.FC<StudyActionsCardProps> = (props) => {
    const [isPending, startTransition] = useTransition();
    const [newStudyRules, setNewStudyRules] = useState<Expression[] | undefined>(undefined);
    const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
    const [successMsg, setSuccessMsg] = useState<string | undefined>(undefined);

    const submit = async () => {
        setErrorMsg(undefined);
        setSuccessMsg(undefined);
        if (newStudyRules) {
            startTransition(async () => {
                try {
                    const response = await runCustomRules(props.studyKey, { rules: newStudyRules })
                    const participantCount = response?.participantCount || 0;
                    const participantsChanged = Math.max(...response?.participantStateChangePerRule) || 0;
                    setSuccessMsg('Finsihed: ' + participantCount + ' participants processed. ' + participantsChanged + ' participants changed.');
                }
                catch (e: any) {
                    setErrorMsg(e.message);
                    console.error(e);
                }
            })
        };
    };

    return (
        <Card
            variant={'opaque'}
        >
            <CardHeader className="">
                <h3 className='text-xl font-bold flex items-center'>
                    <BsBracesAsterisk className='mr-2 text-neutral-500' />
                    Study actions
                </h3>
            </CardHeader>

            <CardContent className='max-h-[400px] overflow-y-scroll'>
                <div className='flex flex-col gap-4'>
                    <div className='space-y-3'>
                        <Filepicker
                            id='upload-one-time-study-rules'
                            label='Run custom rules'
                            accept={{
                                'application/json': ['.json'],
                            }}
                            onChange={(files) => {
                                setErrorMsg(undefined);
                                setSuccessMsg(undefined);
                                if (files.length > 0) {
                                    // read file as a json
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        const text = e.target?.result;
                                        if (typeof text === 'string') {
                                            const data = JSON.parse(text);

                                            if (!checkIfValidCustomStudyRules(data)) {
                                                setErrorMsg('Selected file does not appear to be a valid custom rule file. Please check if you have selected the correct file.');
                                                return;
                                            }
                                            setNewStudyRules(data as Expression[]);
                                        } else {
                                            setNewStudyRules(undefined);
                                            console.error('error');
                                        }
                                    }
                                    reader.readAsText(files[0]);
                                } else {
                                    setNewStudyRules(undefined);
                                }
                            }}
                        />
                        <LoadingButton

                            color='secondary'
                            size='lg'
                            isLoading={isPending}
                            disabled={newStudyRules === undefined}

                            onClick={() => {
                                submit();
                            }}
                        >
                            Run
                        </LoadingButton>
                    </div>

                    {errorMsg && <p className='text-danger'>{errorMsg}</p>}
                    {successMsg && <p className='text-success'>{successMsg}</p>}
                    {isPending && <div className='space-y-2 mt-2'>
                        <p className='text-sm'>
                            Processing rules for participants... this may take a while.
                        </p>

                    </div>}
                </div>
            </CardContent>

        </Card>
    );
};

export default StudyActionsCard;
