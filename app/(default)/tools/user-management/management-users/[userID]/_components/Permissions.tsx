import React from 'react';

interface PermissionsProps {
    userId: string;
}

const Permissions: React.FC<PermissionsProps> = (props) => {
    return (
        <p>Permissions</p>
    );
};

export default Permissions;

export const PermissionsSkeleton: React.FC = () => {
    return (
        <p>PermissionsSkeleton</p>
    );
}
