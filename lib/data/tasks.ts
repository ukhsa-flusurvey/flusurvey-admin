'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";

export interface Task {
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    targetCount: number;
    processedCount: number;
    resultFile?: string;
    error?: string;
}


export const startFileExportTask = async (
    url: string,
    filter?: string,
    sort?: string,
): Promise<{
    error?: string,
    task?: Task
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const queryParams = new URLSearchParams();
    if (filter) {
        queryParams.append('filter', filter);
    }
    if (sort) {
        queryParams.append('sort', sort);
    }
    const queryString = queryParams.toString();
    const urlWithQuery = `${url}?${queryString}`;

    const resp = await fetchCASEManagementAPI(
        urlWithQuery,
        session.CASEaccessToken,
        {
            method: 'POST',
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to start export task: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const getTaskProgress = async (
    resourceUrl: string,
    taskID: string,
): Promise<{
    error?: string,
    task?: Task
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const urlWithID = `${resourceUrl}/task/${taskID}`;

    const resp = await fetchCASEManagementAPI(
        urlWithID,
        session.CASEaccessToken,
        {
            method: 'GET',
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to get task progress: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}
