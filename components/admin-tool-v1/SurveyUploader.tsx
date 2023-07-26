'use client';

import React, { useState, useTransition } from 'react';
import Filepicker from '../inputs/Filepicker';
import Button from '../buttons/Button';
import { Survey } from 'survey-engine/data_types';
import { useRouter } from 'next/navigation';
import { uploadSurvey } from '@/app/(default)/tools/admin-v1/studies/[studyKey]/surveyUploadAction';

interface SurveyUploaderProps {
    studyKey: string;
}

const SurveyUploader: React.FC<SurveyUploaderProps> = ({ studyKey }) => {
    const [newSurvey, setNewSurvey] = useState<Survey | undefined>(undefined);
    const router = useRouter()
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [isPending, startTransition] = useTransition();


    const submit = async () => {
        setError(undefined);
        setSuccess(undefined)
        if (newSurvey) {
            startTransition(async () => {

                try {
                    const response = await uploadSurvey(studyKey, newSurvey)
                    router.refresh();
                }
                catch (e: any) {
                    setError(e.message);
                    console.log(e);
                }
            })
        };
    };


    return (
        <>
            <h3 className='text-slate-500 font-bold mb-2'>New survey</h3>
            <Filepicker
                accept={{
                    'application/json': ['.json'],
                }}
                onChange={(files) => {
                    if (files.length > 0) {
                        // read file as a json
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const text = e.target?.result;
                            if (typeof text === 'string') {
                                const data = JSON.parse(text);
                                setNewSurvey(data as Survey);
                            } else {
                                setNewSurvey(undefined);
                                console.log('error');
                            }
                        }
                        reader.readAsText(files[0]);
                    }
                    console.log(files);
                }}
            />
            {error && <p className='text-red-500'>{error}</p>}
            {success && <p className='text-green-500'>{success}</p>}
            <Button
                disabled={newSurvey === undefined || isPending}
                onClick={() => {
                    submit();
                    // console.log('create survey');
                }}>
                Upload
            </Button>
        </>
    );
};

export default SurveyUploader;
