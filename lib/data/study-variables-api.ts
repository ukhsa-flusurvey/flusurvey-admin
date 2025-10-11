'use server'

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { CreateStudyVariablePayload, StudyVariable, StudyVariableType, UpdateStudyVariableConfigsPayload } from "@/utils/server/types/study-variables";
import { revalidatePath } from "next/cache";

export const getStudyVariables = async (
    studyKey: string,
): Promise<{
    error?: string,
    variables?: Array<StudyVariable>
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/variables`;
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

export const getStudyVariable = async (
    studyKey: string,
    variableKey: string,
): Promise<{
    error?: string,
    variable?: StudyVariable
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/variables/${variableKey}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch study variable: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const createStudyVariable = async (
    studyKey: string,
    variable: CreateStudyVariablePayload,
): Promise<{
    error?: string
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/variables`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify({
                variableDef: variable
            }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to create study variable: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath(`/tools/study-configurator/${studyKey}/variables`);
    return resp.body;
}

export const updateStudyVariableConfigs = async (
    studyKey: string,
    variableKey: string,
    updatedFields: UpdateStudyVariableConfigsPayload,
): Promise<{
    error?: string
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/variables/${variableKey}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'PUT',
            body: JSON.stringify({
                variableDef: updatedFields,
            }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to update study variable configs: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath(`/tools/study-configurator/${studyKey}/variables`);
    return resp.body;
}

export const updateStudyVariableValue = async (
    studyKey: string,
    variableKey: string,
    type: StudyVariableType,
    value: string | number | boolean | Date,
): Promise<{
    error?: string
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/variables/${variableKey}/value`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'PUT',
            body: JSON.stringify({ variable: { value, type } }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to update study variable value: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath(`/tools/study-configurator/${studyKey}/variables`);
    return resp.body;
}

export const deleteStudyVariable = async (
    studyKey: string,
    variableKey: string,
): Promise<{
    error?: string
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }

    const url = `/v1/studies/${studyKey}/variables/${variableKey}`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to delete study variable: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}
