'use server'

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { revalidatePath } from "next/cache";

// add permission

export const addStudyPermission = async (studyKey: string, userId: string, action: string, limiter?: { [key: string]: string }): Promise<{
    error?: string,
    message?: string
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/permissions`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify({
                resourceType: 'study',
                resourceKey: studyKey,
                subjectId: userId,
                action,
                limiter,
            }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to add permission: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator');
    return resp.body;
}


export const deleleStudyPermission = async (studyKey: string, permissionId: string): Promise<{
    error?: string,
    message?: string
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/permissions/${permissionId}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to delete permission: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator');
    return resp.body;
}

