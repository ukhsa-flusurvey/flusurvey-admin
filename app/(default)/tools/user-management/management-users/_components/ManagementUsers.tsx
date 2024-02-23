import React from 'react';
import CardWrapper from './CardWrapper';

import { fetchCASEManagementAPI } from '@/utils/server/fetch-case-management-api';

interface ManagementUsersProps {
}

// TODO: centralised get request to case-management-api (to be later to use mTLS)





const getManagementUsers = async () => {
    const url = '/api/case-management-api/v1/user-management/management-users';
    const resp = await fetchCASEManagementAPI(url, 'accessToken');
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
