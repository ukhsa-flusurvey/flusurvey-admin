'use server'

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { Expression } from "survey-engine/data_types";


export const runStudyActionForParticipant = async (studyKey: string,
    rules: Expression[], participantID: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/run-actions/participants/${participantID}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify({
                rules: rules,
            }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to start export task: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const runStudyActionForAllParticipants = async (studyKey: string,
    rules: Expression[]) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/run-actions/participants`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify({
                rules: rules,
            }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to start export task: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const runStudyActionOnPreviousResponses = async (studyKey: string,
    rules: Expression[], participantID: string, surveyKeys?: string[], fromDate?: Date, toDate?: Date) => {

    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/run-actions/previous-responses/${participantID}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify({
                rules: rules,
                surveyKeys: surveyKeys,
                from: fromDate ? fromDate.getTime() / 1000 : undefined,
                to: toDate ? toDate.getTime() / 1000 : undefined,
            }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to start export task: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const runStudyActionOnPreviousResponsesForAllParticipants = async (studyKey: string,
    rules: Expression[], surveyKeys?: string[], fromDate?: Date, toDate?: Date) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/run-actions/previous-responses`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify({
                rules: rules,
                surveyKeys: surveyKeys,
                from: fromDate ? fromDate.getTime() / 1000 : undefined,
                to: toDate ? toDate.getTime() / 1000 : undefined,
            }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to start export task: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}
