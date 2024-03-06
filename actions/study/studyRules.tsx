'use server'

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { revalidatePath } from "next/cache";
import { Expression } from "survey-engine/data_types";


export const saveStudyRules = async (studyKey: string, rules: Expression[]) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/rules`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'POST',
            revalidate: 0,
            body: JSON.stringify({
                rules,
            })
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to save study rules: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator')
    return resp.body;
}

export const deleteStudyRuleVersion = async (studyKey: string, versionID: string): Promise<{
    error?: string,
    message?: string
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/rules/versions/${versionID}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to delete study rules version: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator')
    return resp.body;
}
