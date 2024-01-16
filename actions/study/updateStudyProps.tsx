'use server';

import { auth } from "@/auth";
import { getCASEManagementAPIURL } from "@/utils/server/api";
import { StudyProps } from "@/utils/server/types/studyInfos";



export const updateStudyProps = async (studyKey: string, props: StudyProps) => {
    const session = await auth();
    if (!session || !session.accessToken) throw new Error('unauthenticated');

    const url = getCASEManagementAPIURL(`/v1/study/${studyKey}/props`);
    const r = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ props }),
        next: { revalidate: 0 }
    });
    if (r.status !== 200) {
        console.error(await r.json());
        throw new Error('upload failed');
    }
    return r.json();
}