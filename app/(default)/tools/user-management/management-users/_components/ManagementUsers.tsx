import React from 'react';
import CardWrapper from './CardWrapper';

import { fetchCASEManagementAPI } from '@/utils/server/fetch-case-management-api';
import { auth } from '@/auth';

interface ManagementUsersProps {
}

const getManagementUsers = async () => {
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
    return resp;
}

const ManagementUsers: React.FC<ManagementUsersProps> = async (props) => {

    // const users = await
    // throw new Error('Not implemented');
    const users = await getManagementUsers();
    console.log(users);

    return (
        <CardWrapper>
            todo: user list
        </CardWrapper>
    );
};

export default ManagementUsers;
