'use client';

import React, { useState } from 'react';
import { Expression } from 'survey-engine/data_types';
import Filepicker from '../inputs/Filepicker';
import Button from '../buttons/Button';
import { useRouter } from 'next/navigation';

interface StudyRuleUploaderProps {
    studyKey: string;
}

const StudyRuleUploader: React.FC<StudyRuleUploaderProps> = ({ studyKey }) => {
    const [newStudyRules, setNewStudyRules] = useState<Expression[] | undefined>(undefined);
    const router = useRouter()
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const uploadStudyRules = async () => {
        setError(undefined);
        setSuccess(undefined)
        setIsLoading(true);
        if (newStudyRules) {
            try {
                const url = new URL(`/api/case-management-api/v1/study/${studyKey}/rules`, process.env.NEXT_PUBLIC_API_URL)
                const response = await fetch(url.toString(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ rules: newStudyRules }),
                });
                const data = await response.json();
                if (response.status !== 200) {
                    setError(data.error);
                    console.log(data);
                } else {
                    console.log(data);
                    setSuccess('Study rules uploaded successfully');
                    router.refresh();
                }
            }
            catch (e: any) {
                setError(e.message);
                console.log(e);
            }
        }
        setIsLoading(false);
    }

    return (
        <div>
            <h3 className='text-slate-500 font-bold mb-2'>Select study rule:</h3>

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
                                setNewStudyRules(data as Expression[]);
                            } else {
                                setNewStudyRules(undefined);
                                console.log('error');
                            }
                        }
                        reader.readAsText(files[0]);
                    }
                    console.log(files);
                }}
            />
            {success && <p className='text-green-500'>{success}</p>}
            {error && <p className='text-red-500'>{error}</p>}
            <Button
                disabled={newStudyRules === undefined || isLoading}
                onClick={() => {
                    uploadStudyRules();
                }}>
                Upload
            </Button>
        </div>
    );
};

export default StudyRuleUploader;
