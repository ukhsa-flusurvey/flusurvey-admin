'use client';

import React, { useTransition } from 'react';
import StudyPropertyEditor from '../study-property-editor/StudyPropertyEditor';
import { Study } from '@/utils/server/types/studyInfos';
import { useRouter } from 'next/navigation';
import { createStudy } from '@/app/(default)/tools/admin-v1/studies/new/createStudyAction';


interface NewStudyProps {
}

const NewStudy: React.FC<NewStudyProps> = (props) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const onSubmit = async (study: Study) => {
        startTransition(async () => {
            try {
                const r = await createStudy(study);
                router.refresh();
                router.replace(`/tools/admin-v1/studies/${r.key}`);
            } catch (e: any) {
                if (e.message === 'unauthenticated') {
                    router.push('/auth/login?callbackUrl=/tools/admin-v1/studies/new');
                    return;
                }
                console.error(e);
            }
        });
    };

    return (
        <StudyPropertyEditor
            onSubmit={(study) => {
                console.log(study);
                onSubmit(study);
            }}
        />
    );
};

export default NewStudy;
