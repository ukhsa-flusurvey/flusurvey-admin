'use server'

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { revalidatePath } from "next/cache";
import { Survey } from "survey-engine/data_types";


export const createNewSurvey = async (studyKey: string, survey: Survey) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, error: 'Unauthorized' };
    }

    let url = `/v1/studies/${studyKey}/surveys`;

    const resp = await fetchCASEManagementAPI(url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify(survey),
            revalidate: 0,
        });
    if (resp.status > 201) {
        return { error: `Failed to create survey: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator');
    return resp.body;
}

export const deleteSurveyVersion = async (studyKey: string, surveyKey: string, versionId: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, error: 'Unauthorized' };
    }

    let url = `/v1/studies/${studyKey}/surveys/${surveyKey}/versions/${versionId}`;

    const resp = await fetchCASEManagementAPI(url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        });
    if (resp.status > 201) {
        return { error: `Failed to delete survey version: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator');
    return resp.body;
}

export const unpublishSurvey = async (studyKey: string, surveyKey: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, error: 'Unauthorized' };
    }

    let url = `/v1/studies/${studyKey}/surveys/${surveyKey}/unpublish`;

    const resp = await fetchCASEManagementAPI(url,
        session.CASEaccessToken,
        {
            method: 'POST',
            revalidate: 0,
        });
    if (resp.status !== 200) {
        return { error: `Failed to unpublish survey: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator');
    return resp.body;
}
