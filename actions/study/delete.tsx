'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { revalidatePath } from "next/cache";



export const deleteStudyAction = async (studyKey: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, error: 'Unauthorized' };
    }

    let url = `/v1/studies/${studyKey}`;

    const resp = await fetchCASEManagementAPI(url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        });
    if (resp.status > 201) {
        return { error: `Failed to create study: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator');

    return resp.body;
}
