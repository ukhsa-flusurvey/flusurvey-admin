'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const deleteManagementUser = async (userID: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { status: 401, error: 'Unauthorized' };
    }

    const resp = await fetchCASEManagementAPI(`/v1/user-management/management-users/${userID}`,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        });
    if (resp.status !== 200) {
        return { error: `Failed to delete user: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/user-management/management-users', 'page');
    return resp.body;
}
