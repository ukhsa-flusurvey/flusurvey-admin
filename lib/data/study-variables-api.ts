'use server'

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";


export enum StudyVariableType {
    STRING = 'string',
    INTEGER = 'int',
    FLOAT = 'float',
    BOOLEAN = 'boolean',
    DATE = 'date',
}

export interface StudyVariableIntConfig {
    min?: number;
    max?: number;
}

export interface StudyVariableFloatConfig {
    min?: number;
    max?: number;
}

export interface StudyVariableDateConfig {
    min?: Date;
    max?: Date;
}

export interface StudyVariableStringConfig {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    possibleValues?: string[];
}

export interface StudyVariable {
    id?: string;
    createdAt: string;
    configUpdatedAt: string;
    valueUpdatedAt: string;

    studyKey: string;

    key: string;
    value: string | number | boolean | Date;
    type: StudyVariableType;

    // Metadata
    label?: string;
    description?: string;
    uiType?: string;
    uiPriority?: number;

    configs?: StudyVariableIntConfig | StudyVariableFloatConfig | StudyVariableDateConfig | StudyVariableStringConfig;
}

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
    variable: StudyVariable,
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
    return resp.body;
}

export const updateStudyVariableConfigs = async (
    studyKey: string,
    variableKey: string,
    updatedFields: Partial<StudyVariable>,
): Promise<{
    error?: string
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/variables/${variableKey}/configs`;
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
    return resp.body;
}

export const updateStudyVariableValue = async (
    studyKey: string,
    variableKey: string,
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
            body: JSON.stringify({ variable: { value } }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to update study variable value: ${resp.status} - ${resp.body.error}` };
    }
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
