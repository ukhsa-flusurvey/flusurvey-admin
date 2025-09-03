import { getAppRoleTemplates } from "@/lib/data/userManagementAPI";
import AppRolesTemplateListClient from './app-roles-template-list-client';

const AppRolesTemplateList = async () => {
    const resp = await getAppRoleTemplates();
    if (resp.error) {
        return (
            <div>
                <p>Error: {resp.error}</p>
            </div>
        )
    }
    if (!resp.appRoleTemplates || resp.appRoleTemplates.length === 0) {
        return (
            <div>
                <p>No app role templates found</p>
            </div>
        )
    }

    return <AppRolesTemplateListClient templates={resp.appRoleTemplates} />
}

export default AppRolesTemplateList;
