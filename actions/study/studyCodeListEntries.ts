'use server'

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { revalidatePath } from "next/cache";


export const addStudyCodeListEntries = async (studyKey: string, listKey: string, codes: string[]) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/study-code-list/codes`;

    const resp = await fetchCASEManagementAPI(url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify({
                listKey,
                codes,
            }),
            revalidate: 0,
        });
    if (resp.status > 200) {
        return { error: `Failed to add codes: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator');
    return resp.body;
}

export const deleteStudyCodeListEntry = async (studyKey: string, listKey: string, code?: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, error: 'Unauthorized' };
    }
    const codeQuery = code ? `&code=${code}` : '';
    const url = `/v1/studies/${studyKey}/study-code-list/codes?listKey=${listKey}${codeQuery}`;

    const resp = await fetchCASEManagementAPI(url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        });
    if (resp.status > 200) {
        return { error: `Failed to delete code: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator');
    return resp.body;
}
