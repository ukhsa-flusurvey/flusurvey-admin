import { getAppRoleTemplates } from '@/lib/data/userManagementAPI';
import React from 'react'

const Page = async () => {
    const appRoleTemplates = await getAppRoleTemplates();

    console.log(appRoleTemplates);
    return (
        <div>page</div>
    )
}

export default Page
