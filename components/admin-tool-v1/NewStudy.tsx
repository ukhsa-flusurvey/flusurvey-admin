'use client';
import React, { useTransition } from 'react';
import StudyPropertyEditor from '../study-property-editor/StudyPropertyEditor';
import { Study } from '@/utils/server/types/studyInfos';
import { useRouter } from 'next/navigation';

interface NewStudyProps {
}

const NewStudy: React.FC<NewStudyProps> = (props) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const createStudy = async (study: Study) => {
        const url = new URL(`/api/case-management-api/v1/studies`, process.env.NEXT_PUBLIC_API_URL)
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ study }),
        });
        const data = await response.json();
        console.log(data);

        startTransition(() => {
            router.refresh();
            router.replace(`/tools/admin-v1/studies/${data.key}`);
        })
    };


    return (
        <StudyPropertyEditor
            onSubmit={(study) => {
                console.log(study);
                createStudy(study);
            }}
        />
    );
};

export default NewStudy;
