import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import { ApiError, AuthAPIFetcher } from '@/utils/server/fetcher';
import { SurveyInfos } from '@/utils/server/types/studyInfos';
import AuthManager from '@/components/AuthManager';
import Filepicker from '@/components/inputs/Filepicker';
import Button from '@/components/buttons/Button';
import { Survey } from 'survey-engine/data_types';
import { useState } from 'react';


export default function Dashboard() {
    const router = useRouter()
    const { study: studyKey } = router.query;


    const [newSurvey, setNewSurvey] = useState<Survey | undefined>(undefined);


    const { data: surveyList, error, isLoading, mutate } = useSWR<SurveyInfos, ApiError>(`/api/studies/${studyKey}/surveys`, AuthAPIFetcher);

    console.log(studyKey, surveyList, error, isLoading);

    const createSurvey = async () => {
        if (newSurvey) {
            try {
                const response = await fetch(`/api/studies/${studyKey}/surveys`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newSurvey),
                });
                const data = await response.json();
                console.log(data);
                mutate();
            }
            catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <AuthManager>
            <div
                className='p-4'
            >
                <div>
                    <Link
                        className='block mb-2 hover:underline text-blue-600 '
                        href={`/studies`}
                    >
                        Back
                    </Link>
                </div>
                <main className='flex'>
                    <div
                    >

                        <h2 className='mt-4 mb-2 font-bold text-slate-500'>Surveys:</h2>
                        {isLoading && <div>Loading...</div>}
                        {error && <div className='text-red-500'>
                            Error: {error.message} - Reason: {error.info.error}</div>}

                        {surveyList?.infos ? surveyList.infos.map((survey: any) => {
                            return <div key={survey.surveyKey}>
                                {survey.surveyKey}
                            </div>
                        }) : null}
                        {(surveyList?.infos === undefined || surveyList?.infos?.length === 0) && <div>No surveys</div>}

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
                        <Button
                            disabled={newSurvey === undefined}
                            onClick={() => {
                                createSurvey();
                                console.log('create survey');
                            }}>
                            Upload
                        </Button>
                    </div>
                </main>
            </div>
        </AuthManager>
    )
}
