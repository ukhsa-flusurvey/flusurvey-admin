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
    if (!session || !session.CASEaccessToken) throw new Error('unauthenticated');

    const url = getCASEManagementAPIURL(`/v1/messaging/auto-message/${id}`);
    const r = await fetch(url.toString(), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${session?.CASEaccessToken}`,
        },
        next: { revalidate: 0 }
    });
    if (r.status !== 200) {
        console.error(await r.json());
        throw new Error('Failed to delete message schedule');
    }
    return r.json();
}
