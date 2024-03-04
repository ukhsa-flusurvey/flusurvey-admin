'use server';

import { auth } from "@/auth";
import { getCASEManagementAPIURL } from "@/utils/server/api";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { revalidatePath } from "next/cache";



export const saveStudyNotifications = async (studyKey: string, subscriptions: { messageType: string; email: string }[]) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, error: 'Unauthorized' };
    }

    const url = `/v1/study/${studyKey}/notification-subscriptions`;

    const resp = await fetchCASEManagementAPI(url,
        session.CASEaccessToken,
        {
            method: 'PUT',
            body: JSON.stringify({ subscriptions }),
            revalidate: 0,
        });
    if (resp.status > 200) {
        return { error: `Failed to update: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator');
    return resp.body;
}
