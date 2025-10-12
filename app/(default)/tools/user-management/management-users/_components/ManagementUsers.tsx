import React from 'react';
import CardWrapper from './CardWrapper';

import ListItem, { ManagementUser } from './ListItem';
import { getManagementUsers } from '@/lib/data/userManagementAPI';


const ManagementUsers: React.FC = async () => {
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

    const users = response.users.map((user: ManagementUser): ManagementUser => {
        return {
            ...user,
            lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined,
            createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
        }
    }).sort((a: ManagementUser, b: ManagementUser) => {
        return a.username.localeCompare(b.username);
    });

    return (
        <CardWrapper>
            <ul
                className='divide-y divide-black/10'
            >
                {users.map((user: ManagementUser) => (
                    <ListItem key={user.id} user={user} />
                ))}
            </ul>
        </CardWrapper>
    );
};

export default ManagementUsers;
