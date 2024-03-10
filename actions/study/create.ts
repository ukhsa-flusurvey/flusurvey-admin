'use server'

import { newStudySchema } from "@/app/(default)/tools/study-configurator/new/CreateStudyForm";
import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { revalidatePath } from "next/cache";
import { z } from "zod"


export const createStudy = async (newStudy: z.infer<typeof newStudySchema>) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, error: 'Unauthorized' };
    }

    let url = `/v1/studies`;

    const resp = await fetchCASEManagementAPI(url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify(newStudy),
            revalidate: 0,
        });
    if (resp.status > 201) {
        return { error: `Failed to create study: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/study-configurator');
    return resp.body;
}
