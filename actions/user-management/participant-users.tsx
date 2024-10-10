'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";

export const requestDeletionForParticipantUser = async (
    email: string
) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, error: 'Unauthorized' };
    }

    const resp = await fetchCASEManagementAPI(`/v1/user-management/participant-users/request-deletion`,
        session.CASEaccessToken,
        {
            method: 'POST',
            revalidate: 0,
            body: JSON.stringify({
                email
            }),
        });
    if (resp.status !== 200) {
        return { error: `Failed to delete user: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}
