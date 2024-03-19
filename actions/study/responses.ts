'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { revalidatePath } from "next/cache";

export const deleteResponses = async (
    studyKey: string,
    surveyKey: string,
    filter?: string,
    controlField?: string,
): Promise<{
    error?: string,
    message?: string
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const queryParams = new URLSearchParams();
    queryParams.append('surveyKey', surveyKey);
    if (filter) {
        queryParams.append('filter', filter);
    }
    queryParams.append('controlField', controlField || '');

    const queryString = queryParams.toString();
    const url = `/v1/studies/${studyKey}/data-explorer/responses?${queryString}`;

    const resp = await fetchCASEManagementAPI(url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        });
    if (resp.status > 200) {
        return { error: `Failed to delete responses: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/participants');

    return resp.body;
}
