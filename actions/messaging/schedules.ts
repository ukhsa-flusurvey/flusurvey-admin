'use server';

import { auth } from "@/auth";
import { getCASEManagementAPIURL } from "@/utils/server/api";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { MessageSchedule } from "@/utils/server/types/messaging";
import { revalidatePath } from "next/cache";


export const saveMessageSchedule = async (
    messageSchedule: MessageSchedule
) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, body: { error: 'Unauthorized' } };
    }

    const url = `/v1/messaging/scheduled-emails`;
    const resp = await fetchCASEManagementAPI(url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify(messageSchedule),
            revalidate: 0,
        });
    if (resp.status !== 200) {
        return { error: `Failed to save template: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/messaging/schedules');
    return resp.body;
}

export const deleteMessageSchedule = async (
    id: string
) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, body: { error: 'Unauthorized' } };
    }

    const url = `/v1/messaging/scheduled-emails/${id}`;
    const resp = await fetchCASEManagementAPI(url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        });
    if (resp.status !== 200) {
        return { error: `Failed to save template: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/messaging/schedules');
    return resp.body;
}
