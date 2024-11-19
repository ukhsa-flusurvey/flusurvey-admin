import { Study } from "@/utils/server/types/studyInfos";
import { ManagementUserPermission } from "./data/userManagementAPI";

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
