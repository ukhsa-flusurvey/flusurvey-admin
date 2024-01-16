'use server'

import { auth } from "@/auth";
import { getCASEManagementAPIURL } from "@/utils/server/api";
import { Study } from "@/utils/server/types/studyInfos";


export const createStudy = async (study: Study): Promise<Study> => {
    const session = await auth();
    if (!session || !session.accessToken) throw new Error('unauthenticated');
    const url = getCASEManagementAPIURL('/v1/studies');
    const r = await fetch(url.toString(), {
        method: 'POST',
        body: JSON.stringify({ study }),
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
            'Content-Type': 'application/json'
        },
        next: { revalidate: 0 }
    });
    if (r.status !== 200) {
        console.log(await r.json());
        throw new Error('Failed to create study');
    }
    return r.json();
}
