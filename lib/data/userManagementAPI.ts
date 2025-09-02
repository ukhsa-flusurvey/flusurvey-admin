'use server';

import { ManagementUser } from "@/app/(default)/tools/user-management/management-users/_components/ListItem";
import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";

export interface ManagementUserPermission {
    id: string;
    subjectId: string;
    subjectType: string;
    resourceType: string;
    resourceKey: string;
    action: string;
    limiter?: { [key: string]: string };
}

export const getPermissionsForCurrentUser = async (): Promise<{ error?: string } & {
    isAdmin: boolean;
    permissions: Array<ManagementUserPermission>;
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized', isAdmin: false, permissions: [] };
    }
    const url = '/v1/auth/permissions';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch permissions: ${resp.status} - ${resp.body.error}`, isAdmin: false, permissions: [] };
    }
    return resp.body;
}

export const getManagementUsers = async () => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/management-users';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch management users: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const getManagementUser = async (userId: string): Promise<
    { error?: string, user?: ManagementUser }
> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/management-users/' + userId;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch management user: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const getPermissions = async (userId: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/management-users/' + userId + '/permissions';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch management user's permissions: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

/*
 App role template API
*/


export interface AppRoleTemplate {
    id?: string;
    appName: string;
    role: string;
    requiredPermissions: Array<ManagementUserPermission>;
    createdAt?: string;
    updatedAt?: string;
};

export interface GetAppRoleTemplatesResponse {
    error?: string;
    appRoleTemplates?: AppRoleTemplate[] | null;
}

export interface GetAppRoleTemplateResponse {
    error?: string;
    appRoleTemplate?: AppRoleTemplate;
}

export interface CreateAppRoleTemplateResponse {
    error?: string;
    appRoleTemplate?: AppRoleTemplate;
}

export interface UpdateAppRoleTemplateResponse {
    error?: string;
    appRoleTemplate?: AppRoleTemplate;
}

export interface DeleteAppRoleTemplatesForAppResponse {
    error?: string;
}

export interface DeleteAppRoleTemplateResponse {
    error?: string;
}

export const getAppRoleTemplates = async (): Promise<GetAppRoleTemplatesResponse> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/app-roles/templates';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch app role templates: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body as GetAppRoleTemplatesResponse;
}

export const createAppRoleTemplate = async (
    data: Partial<AppRoleTemplate>
): Promise<CreateAppRoleTemplateResponse> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/app-roles/templates/';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify(data),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to create app role template: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body as CreateAppRoleTemplateResponse;
}

export const getAppRoleTemplate = async (
    appRoleTemplateID: string
): Promise<GetAppRoleTemplateResponse> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/app-roles/templates/' + appRoleTemplateID;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch app role template: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body as GetAppRoleTemplateResponse;
}

export const updateAppRoleTemplate = async (
    appRoleTemplateID: string,
    data: Partial<AppRoleTemplate>
): Promise<UpdateAppRoleTemplateResponse> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/app-roles/templates/' + appRoleTemplateID;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'PUT',
            body: JSON.stringify(data),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to update app role template: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body as UpdateAppRoleTemplateResponse;
}

export const deleteAppRoleTemplatesForApp = async (
    appName: string
): Promise<DeleteAppRoleTemplatesForAppResponse> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/app-roles/templates/delete-for-app/' + appName;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to delete app role templates for app: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body as DeleteAppRoleTemplatesForAppResponse;
}

export const deleteAppRoleTemplate = async (
    appRoleTemplateID: string
): Promise<DeleteAppRoleTemplateResponse> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/app-roles/templates/delete/' + appRoleTemplateID;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to delete app role template: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body as DeleteAppRoleTemplateResponse;
}

