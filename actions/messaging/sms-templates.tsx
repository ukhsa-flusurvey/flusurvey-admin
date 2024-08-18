'use server';


import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { SMSTemplate } from "@/utils/server/types/messaging";
import { revalidatePath } from "next/cache";


export const uploadSmsTemplate = async (template: SMSTemplate) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, error: 'Unauthorized' };
    }

    let url = `/v1/messaging/sms-templates`;

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
    revalidatePath('/tools/messaging/sms-templates');
    return resp.body;
}
