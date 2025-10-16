'use server'

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { StudyCounter } from "@/utils/server/types/study-counters";
import { revalidatePath } from "next/cache";

export const getStudyCounters = async (
    studyKey: string,
): Promise<{
    error?: string,
    values?: Array<StudyCounter>
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/study-counters`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch study counters: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const saveStudyCounter = async (
    studyKey: string,
    scope: string,
    value: number,
): Promise<{
    error?: string,
    value?: number,
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/study-counters/${scope}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify({ value }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to save study counter: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath(`/tools/study-configurator/${studyKey}/variables`);
    return resp.body;
}

export const incrementStudyCounter = async (
    studyKey: string,
    scope: string,
): Promise<{
    error?: string,
    value?: number,
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/study-counters/${scope}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'PUT',
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to increment study counter: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath(`/tools/study-configurator/${studyKey}/variables`);
    return resp.body;
}

export const deleteStudyCounter = async (
    studyKey: string,
    scope: string,
): Promise<{
    error?: string,
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/study-counters/${scope}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to delete study counter: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath(`/tools/study-configurator/${studyKey}/variables`);
    return resp.body;
}
