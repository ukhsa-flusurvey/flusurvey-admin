'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";
import { revalidatePath } from "next/cache";
import { ManagementUserPermission } from "./userManagementAPI";

export interface ServiceAccount {
    id: string;
    label: string;
    description: string;
}

export interface ServiceAccountAPIKey {
    id: string;
    serviceUserId: string;
    key: string;
    createdAt: string;
    lastUsedAt: string;
    expiresAt: string;
}

export const getServiceAccounts = async (): Promise<{
    error?: string,
    serviceAccounts?: ServiceAccount[]
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/service-accounts';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch service accounts: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const getServiceAccount = async (serviceAccountID: string): Promise<{
    error?: string,
    serviceAccount?: ServiceAccount
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/service-accounts/' + serviceAccountID;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch service account: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const createServiceAccount = async (label: string, description?: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/service-accounts';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify({
                label,
                description,
            }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to create service account: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/user-management/service-accounts');
    return resp.body;
}

export const updateServiceAccount = async (serviceAccountId: string, label: string, description?: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/service-accounts/' + serviceAccountId;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'PUT',
            body: JSON.stringify({
                label,
                description,
            }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to update service account: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/user-management/service-accounts');
    return resp.body;
}

export const deleteServiceAccount = async (serviceAccountId: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/service-accounts/' + serviceAccountId;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to delete service account: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/user-management/service-accounts');
    return resp.body;
}

export const getPermissions = async (serviceAccountId: string): Promise<{
    error?: string,
    permissions?: ManagementUserPermission[]
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/service-accounts/' + serviceAccountId + '/permissions';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch service account's permissions: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const createPermissionForServiceAccount = async (
    serviceAccountId: string,
    resourceType: string,
    resourceKey: string,
    action: string,
    limiter?: { [key: string]: string },
) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/service-accounts/' + serviceAccountId + '/permissions';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify({
                resourceType,
                resourceKey,
                action,
                limiter,
            }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to create permission for service account: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/user-management/service-accounts');
    return resp.body;
}

export const deletePermissionForServiceAccount = async (
    serviceAccountId: string,
    permissionId: string
) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/service-accounts/' + serviceAccountId + '/permissions/' + permissionId;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to delete permission for service account: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/user-management/service-accounts');
    return resp.body;
}

export const getServiceAccountAPIKeys = async (serviceAccountId: string): Promise<{
    error?: string,
    apiKeys?: ServiceAccountAPIKey[]
}> => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/service-accounts/' + serviceAccountId + '/api-keys';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch service account's api keys: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

export const createServiceAccountAPIKey = async (serviceAccountId: string, expirationDate?: number) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/service-accounts/' + serviceAccountId + '/api-keys';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'POST',
            body: JSON.stringify({
                expiresAt: expirationDate,
            }),
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to create service account api key: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/user-management/service-accounts');
    return resp.body;
}

export const deleteServiceAccountAPIKey = async (serviceAccountId: string, apiKeyId: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/service-accounts/' + serviceAccountId + '/api-keys/' + apiKeyId;
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            method: 'DELETE',
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to delete service account api key: ${resp.status} - ${resp.body.error}` };
    }
    revalidatePath('/tools/user-management/service-accounts');
    return resp.body;
}
