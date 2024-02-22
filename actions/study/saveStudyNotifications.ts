'use server';

import { auth } from "@/auth";
import { getCASEManagementAPIURL } from "@/utils/server/api";



export const saveStudyNotifications = async (studyKey: string, subscriptions: { messageType: string; email: string }[]) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) throw new Error('unauthenticated');

    const url = getCASEManagementAPIURL(`/v1/study/${studyKey}/notification-subscriptions`);
    const r = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session?.CASEaccessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscriptions }),
        next: { revalidate: 0 }
    });
    if (r.status !== 200) {
        console.error(await r.json());
        throw new Error('upload failed');
    }
    return r.json();
}
