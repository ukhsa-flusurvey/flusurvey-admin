import React from 'react';
import CardWrapper from './CardWrapper';

import ListItem, { ManagementUser } from './ListItem';
import { getManagementUsers } from '@/lib/data/userManagementAPI';

const hasUsername = (user: ManagementUser): user is ManagementUser & { username: string } => {
    return typeof user.username === 'string' && user.username.trim().length > 0;
}

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

    const invalidUsers = response.users.filter((user: ManagementUser) => !hasUsername(user));

    const users = response.users.filter(hasUsername).map((user: ManagementUser): ManagementUser => {
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
            <div className='space-y-4'>
                {invalidUsers.length > 0 ? (
                    <div className='px-6 py-3 bg-red-100 rounded-md text-red-700'>
                        <h3 className='font-bold'>Management users with missing usernames</h3>
                        <p className='text-sm'>
                            The following user records need to be fixed in the database before they can be displayed normally.
                        </p>
                        <ul className='mt-3 space-y-2 text-sm'>
                            {invalidUsers.map((user: ManagementUser, index: number) => (
                                <li key={user.id || user.sub || user.email || index}>
                                    <span className='font-medium'>ID:</span> {user.id || 'missing'}
                                    {user.email ? <> <span className='font-medium'>Email:</span> {user.email}</> : null}
                                    {user.sub ? <> <span className='font-medium'>Sub:</span> {user.sub}</> : null}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
                {users.length > 0 ? (
                    <ul
                        className='divide-y divide-black/10'
                    >
                        {users.map((user: ManagementUser) => (
                            <ListItem key={user.id} user={user} />
                        ))}
                    </ul>
                ) : (
                    <div className='px-6 py-3 bg-yellow-100 rounded-md text-yellow-700'>
                        <h3 className='font-bold'>No valid users found</h3>
                    </div>
                )}
            </div>
        </CardWrapper>
    );
};

export default ManagementUsers;
