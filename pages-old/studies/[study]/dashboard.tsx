import { useRouter } from 'next/router';
import Link from 'next/link';

import Filepicker from '@/components/inputs/Filepicker';
import Button from '@/components/buttons/Button';

import { useState } from 'react';
import { Expression } from 'survey-engine/data_types';

export default function Dashboard() {
    const router = useRouter()
    const { study: studyKey } = router.query;



    const [newStudyRules, setNewStudyRules] = useState<Expression[] | undefined>(undefined);



    const uploadStudyRules = async () => {
        if (newStudyRules) {
            try {
                const response = await fetch(`/api/studies/${studyKey}/rules`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newStudyRules),
                });
                const data = await response.json();
                console.log(data);
                mutate();
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <>
            <div
                className='p-4'
            >
                <main className='flex'>

                    <div
                        className='ml-4'
                    >
                        <h3 className='text-slate-500 font-bold mb-2 mt-4'>New study rules</h3>
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
                        <Button
                            disabled={newStudyRules === undefined}
                            onClick={() => {
                                uploadStudyRules();
                            }}>
                            Upload
                        </Button>
                    </div>
                </main>
            </div>
        </>
    )
}
