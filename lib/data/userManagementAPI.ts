'use server';

import { auth } from "@/auth";
import { fetchCASEManagementAPI } from "@/utils/server/fetch-case-management-api";

interface Permission {
    id: string;
    subjectId: string;
    resourceType: string;
    resourceKey: string;
    action: string;
    limiter?: { [key: string]: string };
}

export const getPermissionsForCurrentUser = async (): Promise<{ error?: string } & {
    isAdmin: boolean;
    permissions: Array<Permission>;
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

export const getManagementUser = async (userId: string) => {
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
