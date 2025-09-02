'use server'

import { revalidatePath } from 'next/cache';
import { AppRoleTemplate, createAppRoleTemplate as createTemplate, updateAppRoleTemplate as updateTemplate, deleteAppRoleTemplate as deleteTemplate, deleteAppRoleTemplatesForApp as deleteTemplatesForApp } from '@/lib/data/userManagementAPI';

export const createAppRoleTemplateAction = async (
    data: Partial<AppRoleTemplate>
) => {
    const resp = await createTemplate(data);
    if (resp.error) {
        return { error: resp.error } as const;
    }
    revalidatePath('/tools/user-management/app-roles');
    return { appRoleTemplate: resp.appRoleTemplate } as const;
}


export const updateAppRoleTemplateAction = async (
    id: string,
    data: Partial<AppRoleTemplate>
) => {
    const resp = await updateTemplate(id, data);
    if (resp.error) {
        return { error: resp.error } as const;
    }
    revalidatePath('/tools/user-management/app-roles');
    return { appRoleTemplate: resp.appRoleTemplate } as const;
}

export const deleteAppRoleTemplateAction = async (
    id: string,
) => {
    const resp = await deleteTemplate(id);
    if (resp.error) {
        return { error: resp.error } as const;
    }
    revalidatePath('/tools/user-management/app-roles');
    return {} as const;
}

export const deleteAppRoleTemplatesForAppAction = async (
    appName: string,
) => {
    const resp = await deleteTemplatesForApp(appName);
    if (resp.error) {
        return { error: resp.error } as const;
    }
    revalidatePath('/tools/user-management/app-roles');
    return {} as const;
}


