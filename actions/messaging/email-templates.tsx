'use server'

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { EmailTemplate } from "@/utils/server/types/messaging";
import { revalidatePath } from "next/cache";


export const uploadEmailTemplate = async (template: EmailTemplate) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, error: 'Unauthorized' };
    }

    let url = `/v1/messaging/email-templates/global-templates`;
    if (template.studyKey) {
        url = `/v1/messaging/email-templates/study-templates/${template.studyKey}`;
    }

    const resp = await fetchCASEManagementAPI(url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify(template),
            revalidate: 0,
        });
    if (resp.status !== 200) {
        return { error: `Failed to save template: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/messaging/email-templates');
    return resp.body;
}

export const deleteEmailTemplate = async (
    messageType: string,
    studyKey?: string,
) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, error: 'Unauthorized' };
    }

    let url = `/v1/messaging/email-templates/global-templates/${messageType}`;
    if (studyKey) {
        url = `/v1/messaging/email-templates/study-templates/${studyKey}/${messageType}`;
    }

    const resp = await fetchCASEManagementAPI(url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        });
    if (resp.status !== 200) {
        return { error: `Failed to delete template: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/messaging/email-templates');
    return resp.body;
}
