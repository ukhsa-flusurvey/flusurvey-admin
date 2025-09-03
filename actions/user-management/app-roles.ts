'use server'

import { createManagementUserAppRoleFromTemplate, deleteManagementUserAppRole } from "@/lib/data/userManagementAPI";
import { revalidatePath } from "next/cache";

export const deleteAppRoleForManagementUserAction = async (
    userID: string,
    appRoleID: string
) => {
    const resp = await deleteManagementUserAppRole(userID, appRoleID);
    if (resp.error) {
        return { error: resp.error } as const;
    }
    revalidatePath('/tools/user-management');
    return resp;
}


export const assignAppRoleToManagementUserAction = async (
    userID: string,
    appRoleTemplateID: string
) => {
    const resp = await createManagementUserAppRoleFromTemplate(userID, appRoleTemplateID);
    if (resp.error) {
        return { error: resp.error } as const;
    }
    revalidatePath('/tools/user-management');
    return resp;
}


