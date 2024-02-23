import React from 'react';
import CardWrapper from './CardWrapper';

import { fetchCASEManagementAPI } from '@/utils/server/fetch-case-management-api';
import { auth } from '@/auth';
import ListItem, { ManagementUser } from './ListItem';

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
    if (resp.status !== 200) {
        return { error: `Failed to fetch management users: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

const ManagementUsers: React.FC<ManagementUsersProps> = async (props) => {

    // const users = await
    // throw new Error('Not implemented');
    const response = await getManagementUsers();

    const error = response.error;

    if (error) {
        return (
            <CardWrapper>
                <div className='px-6 py-3 bg-red-100 rounded-md text-red-700'>
                    <h3 className='font-bold'>Unexpected error: </h3>
                    {error}
                </div>
            </CardWrapper>
        );
    }

    if (!response.users || response.users.length === 0) {
        return (
            <CardWrapper>
                <div className='px-6 py-3 bg-yellow-100 rounded-md text-yellow-700'>
                    <h3 className='font-bold'>No users found</h3>
                </div>
            </CardWrapper>
        );
    }

    const users = response.users.map((user: any): ManagementUser => {
        return {
            ...user,
            lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined,
            createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
        }
    })

    return (
        <CardWrapper>
            <ul
                className='divide-y-1 divide-black/10'
            >
                {users.map((user: any) => (
                    <ListItem key={user.id} user={user} />
                ))}
            </ul>
        </CardWrapper>
    );
};

export default ManagementUsers;
