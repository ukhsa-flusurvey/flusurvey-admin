import React from 'react';

interface UserDetailsProps {
    userId: string;
}

const UserDetails: React.FC<UserDetailsProps> = async (props) => {
    //wait 3 seconds
    await new Promise(resolve => setTimeout(resolve, 3000));
    return (
        <p>UserDetails</p>
    );
};

export default UserDetails;

export const UserDetailsSkeleton: React.FC = () => {
    return (
        <p>UserDetailsSkeleton</p>
    );
}
