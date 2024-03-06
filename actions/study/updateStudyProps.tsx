'use server';

import { auth } from "@/auth";
import { getCASEManagementAPIURL } from "@/utils/server/api";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { StudyProps } from "@/utils/server/types/studyInfos";
import { revalidatePath } from "next/cache";
import { Expression, LocalizedString } from "survey-engine/data_types";



export const updateStudyStatus = async (studyKey: string, status: string): Promise<{
    error?: string,
    message?: string
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/status`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'PUT',
            body: JSON.stringify({ status }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to update status: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator');
    return resp.body;
}

export const updateStudyIsDefault = async (studyKey: string, isDefault: boolean): Promise<{
    error?: string,
    message?: string
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/is-default`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'PUT',
            body: JSON.stringify({ isDefault }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to update is default value: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator');
    return resp.body;
}

export const updateStudyFileUploadConfig = async (studyKey: string, simplifiedAllowed?: boolean, expression?: Expression): Promise<{
    error?: string,
    message?: string
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/file-upload-config`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'PUT',
            body: JSON.stringify({
                simplifiedAllowedUpload: simplifiedAllowed,
                expression
            }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to update file upload config: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator');
    return resp.body;
}

export const updateStudyDisplayProps = async (studyKey: string,
    name: LocalizedString[],
    description: LocalizedString[],
    tags: Array<{ label: LocalizedString[] }>
): Promise<{
    error?: string,
    message?: string
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = `/v1/studies/${studyKey}/display-props`;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'PUT',
            body: JSON.stringify({
                name,
                description,
                tags
            }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to update file upload config: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator');
    return resp.body;
}
