'use server';

import { getCASEManagementAPIURL } from "@/utils/server/api";
import { MessageSchedule } from "@/utils/server/types/messaging";


export const saveMessageSchedule = async (
    messageSchedule: MessageSchedule,
    accessToken: string
) => {
    const url = getCASEManagementAPIURL('/v1/messaging/auto-messages');
    const r = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({ 'autoMessage': messageSchedule }),
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        next: { revalidate: 0 }
    });
    if (r.status !== 200) {
        console.log(await r.json());
        throw new Error('Failed to save message schedule');
    }
    return r.json();
}

export const deleteMessageSchedule = async (
    id: string,
    accessToken: string
) => {
    const url = getCASEManagementAPIURL(`/v1/messaging/auto-message/${id}`);
    const r = await fetch(url.toString(), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        next: { revalidate: 0 }
    });
    if (r.status !== 200) {
        console.log(await r.json());
        throw new Error('Failed to delete message schedule');
    }
    return r.json();
}
