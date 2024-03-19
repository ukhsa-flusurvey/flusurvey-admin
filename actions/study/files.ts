'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { revalidatePath } from "next/cache";

export const deleteParticipantFile = async (
    studyKey: string,
    fileId: string,
): Promise<{
    error?: string,
    message?: string
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }


    const url = `/v1/studies/${studyKey}/data-explorer/files/${fileId}`;

    const resp = await fetchCASEManagementAPI(url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        });
    if (resp.status > 200) {
        return { error: `Failed to delete file: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/participants');

    return resp.body;
}
