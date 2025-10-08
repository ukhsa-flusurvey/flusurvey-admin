'use server'

import { Study } from '../../utils/server/types/studyInfos';
import { Expression, Survey } from 'survey-engine/data_types';
import { auth } from '@/auth';
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { Pagination } from '@/utils/server/types/paginationInfo';


export const getStudies = async (): Promise<{ error?: string, studies?: Study[] }> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/studies';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch studies: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}


export const getStudy = async (studyKey: string): Promise<{
    error?: string,
    study?: Study
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch study: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const getSurveyInfos = async (studyKey: string): Promise<{
    error?: string,
    surveys?: Array<{
        key: string,
    }>
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/surveys`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch survey keys: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const getSurveyVersions = async (studyKey: string, surveyKey: string): Promise<{
    error?: string,
    versions?: Array<Survey>
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/surveys/${surveyKey}/versions`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch survey versions: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const getSurveyVersion = async (studyKey: string, surveyKey: string, versionID: string): Promise<{
    error?: string,
    survey?: Survey
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/surveys/${surveyKey}/versions/${versionID}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch survey version: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const getStudyNotificationSubscriptions = async (studyKey: string): Promise<{
    error?: string,
    subscriptions?: Array<{
        messageType: string,
        email: string,
    }>
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/notification-subscriptions`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch study notification subscriptions: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export interface PermissionsInfo {
    user: {
        id: string;
        username?: string;
        email?: string;
        imageUrl?: string;
    }
    permissions: Array<{
        id: string;
        action: string;
        limiter?: { [key: string]: string };
    }>;
}

export const getStudyPermissions = async (studyKey: string): Promise<{
    error?: string,
    permissions?: {
        [key: string]: PermissionsInfo
    },
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
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch study permissions: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const getStudyCodeListKeys = async (studyKey: string): Promise<{
    error?: string;
    listKeys?: string[]
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/study-code-list/list-keys`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch study code list keys: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const getStudyCodeListEntries = async (
    studyKey: string,
    listKey: string,
    page: number = 1,
    pageSize: number = 1000,
): Promise<{
    error?: string,
    codeList?: Array<{
        code: string,
        addedAt: string,
    }>
    pagination?: Pagination
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/study-code-list/codes?listKey=${listKey}&page=${page}&limit=${pageSize}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch study code list entries: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const getStudyRulesVersions = async (studyKey: string): Promise<{
    error?: string,
    versions?: Array<{
        id: string,
        uploadedAt: number,
    }>
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/rules/versions`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch study rules versions: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const getStudyRulesVersion = async (studyKey: string, versionID: string): Promise<{
    error?: string,
    studyRules?: {
        id: string,
        uploadedAt: number,
        uploadedBy: string,
        studyKey: string,
        rules: Array<Expression>
    };
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
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch study rules version: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}
