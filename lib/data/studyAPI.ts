'use server'

import { Study } from '../../utils/server/types/studyInfos';
import { Expression, Survey } from 'survey-engine/data_types';
import { auth } from '@/auth';
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { revalidatePath } from 'next/cache';


export const getSurveysForStudy = async (studyKey: string) => {

    throw new Error('Not implemented');

    /*
    const session = await auth();
    if (!session || session.CASEaccessToken === undefined) {
        throw new Error('Unauthorized');
    }

    const url = getCASEManagementAPIURL(`/v1/study/${studyKey}/surveys`);

    const response = await fetch(url,
        {
            headers: {
                ...getTokenHeader(session.CASEaccessToken)
            },
            next: {
                revalidate: 10
            }
        });
    if (response.status !== 200) {
        try {
            const err = await response.json();
            throw new Error(err.error);
        } catch (error) {
            throw new Error(`Error ${response.status} when fetching surveys`);
        }
    }
    const data = await response.json();
    return data;*/
}

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

export const getSurveyKeys = async (studyKey: string): Promise<{
    keys: string[]
}> => {
    throw new Error('Not implemented');

    /*
    const session = await auth();
    if (!session || session.CASEaccessToken === undefined) {
        throw new Error('Unauthorized');
    }

    const url = getCASEManagementAPIURL(`v1/study/${studyKey}/survey-keys`);

    const response = await fetch(url,
        {
            headers: {
                ...getTokenHeader(session.CASEaccessToken)
            },
            next: {
                revalidate: 10
            }
        });
    if (response.status !== 200) {
        try {
            const err = await response.json();
            throw new Error(err.error);
        } catch (error) {
            throw new Error(`Error ${response.status} when fetching survey keys`);
        }
    }
    const data = await response.json();
    return data;*/
}

export const getSurveyVersion = async (studyKey: string, surveyKey: string, versionID: string): Promise<Survey> => {
    throw new Error('Not implemented');

    /*
    const session = await auth();
        if (!session || session.CASEaccessToken === undefined) {
            throw new Error('Unauthorized');
        }

        const url = getCASEManagementAPIURL(`/v1/study/${studyKey}/survey/${surveyKey}/${versionID}`);
        const response = await fetch(url,
            {
                headers: {
                    ...getTokenHeader(session.CASEaccessToken)
                },
                next: {
                    revalidate: 10
                }
            });
        if (response.status !== 200) {
            try {
                const err = await response.json();
                throw new Error(err.error);
            } catch (error) {
                throw new Error(`Error ${response.status} when fetching survey version`);
            }
        }
        const data = await response.json();
        return data;*/
}
