'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { Pagination } from "@/utils/server/types/paginationInfo";
import { Task } from "./tasks";

export const getResponses = async (
    studyKey: string,
    surveyKey: string,
    page: number,
    filter?: string,
    sort?: string,
    pageSize?: number,
    useShortKeys?: boolean,
): Promise<{
    error?: string,
    responses?: Array<{
        [key: string]: number | string | boolean | object
    }>
    pagination?: Pagination
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
    if (sort) {
        queryParams.append('sort', sort);
    }
    queryParams.append('page', page.toString());
    if (pageSize) queryParams.append('limit', pageSize.toString());
    queryParams.append('shortKeys', useShortKeys ? 'true' : 'false');


    const queryString = queryParams.toString();
    const url = `/v1/studies/${studyKey}/data-explorer/responses?${queryString}`;

    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch responses: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}


export const startResponseExport = async (
    studyKey: string,
    surveyKey: string,
    exportFormat: string,
    keySeparator: string,
    queryStartDate: number,
    queryEndDate: number,
    useShortKeys: boolean,
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

    const filter = {
        '$and': [
            { arrivedAt: { '$gt': queryStartDate } },
            { arrivedAt: { '$lt': queryEndDate } }
        ]
    };
    queryParams.append('filter', encodeURIComponent(JSON.stringify(filter)));
    if (sort) {
        queryParams.append('sort', sort);
    }
    queryParams.append('format', exportFormat);
    queryParams.append('questionOptionSep', keySeparator);
    queryParams.append('surveyKey', surveyKey);
    queryParams.append('shortKeys', useShortKeys ? 'true' : 'false');

    const queryString = queryParams.toString();
    const url = `/v1/studies/${studyKey}/data-exporter/responses?${queryString}`;

    const resp = await fetchCASEManagementAPI(
        url,
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

export const getDailyResponseExports = async (
    studyKey: string
): Promise<{
    error?: string,
    availableFiles?: string[]
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const queryParams = new URLSearchParams();
    const queryString = queryParams.toString();
    const url = `/v1/studies/${studyKey}/data-exporter/responses/daily-exports?${queryString}`;

    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch daily response exports: ${resp.status} - ${resp.body.error}` };
    }
    return {
        availableFiles: resp.body.dailyExports
    };
}

export const getAvailableConfidentialResponseExports = async (
    studyKey: string
): Promise<{
    error?: string,
    availableFiles?: string[]
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/data-exporter/confidential-responses`;

    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch confidential response exports: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}
