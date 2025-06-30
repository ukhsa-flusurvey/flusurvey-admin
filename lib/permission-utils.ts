import { Study } from "@/utils/server/types/studyInfos";
import { ManagementUserPermission, getPermissionsForCurrentUser } from "./data/userManagementAPI";

export const filterStudiesWithPermissions = (
    permissionInfos: {
        isAdmin: boolean,
        permissions: Array<ManagementUserPermission>
    },
    studies?: Array<Study>,
): Array<Study> => {
    if (!studies) {
        return [];
    }
    if (permissionInfos.isAdmin) {
        return studies;
    }
    if (!permissionInfos.permissions || permissionInfos.permissions.length === 0) {
        return [];
    }
    return studies.filter((study) => {
        return permissionInfos.permissions.some((permission) => {
            if (permission.resourceType !== 'study') {
                return false;
            }
            return permission.resourceKey === study.key || permission.resourceKey === '*';
        })
    });
}


export const hasPermission = async (
    resourceType: string,
    resourceKey: string,
    permission: string,
) => {
    const currentUserPermissions = await getPermissionsForCurrentUser();
    if (currentUserPermissions.error) {
        throw new Error(currentUserPermissions.error);
    }

    if (currentUserPermissions.isAdmin) {
        return true;
    }

    return currentUserPermissions.permissions?.some((p) =>
        p.resourceType === resourceType && p.resourceKey === resourceKey && p.action === permission);
}
