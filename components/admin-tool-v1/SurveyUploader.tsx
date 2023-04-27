'use client';

import React, { useState } from 'react';
import Filepicker from '../inputs/Filepicker';
import Button from '../buttons/Button';
import { Survey } from 'survey-engine/data_types';
import { useRouter } from 'next/navigation';

interface SurveyUploaderProps {
    studyKey: string;
}

const SurveyUploader: React.FC<SurveyUploaderProps> = ({ studyKey }) => {
    const router = useRouter()
    const [newSurvey, setNewSurvey] = useState<Survey | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const uploadSurvey = async () => {
        setError(undefined);
        setIsLoading(true);
        if (newSurvey) {
            try {
                const url = new URL(`/api/case-management-api/v1/study/${studyKey}/surveys`, process.env.NEXT_PUBLIC_API_URL)
                const response = await fetch(url.toString(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ survey: newSurvey }),
                });
                const data = await response.json();
                console.log(data);
                router.refresh();
            }
            catch (e: any) {
                setError(e.message);
                console.log(e);
            }
        }
        setIsLoading(false);
    };


    return (
        <>
            <h3 className='text-slate-500 font-bold mb-2 mt-4'>New survey</h3>
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
            <Button
                disabled={newSurvey === undefined || isLoading}
                onClick={() => {
                    uploadSurvey();
                    // console.log('create survey');
                }}>
                Upload
            </Button>
        </>
    );
};

export default SurveyUploader;
