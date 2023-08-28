import AppbarBaseForTools from '@/components/navbar/AppbarBaseForTools';
import UserManagementIcon from '@/components/tool-icons/UserManagementIcon';
import React from 'react';

interface UserManagementAppbarBaseProps {
}

const UserManagementAppbarBase: React.FC<UserManagementAppbarBaseProps> = (props) => {
    return (
        <AppbarBaseForTools
            toolName='User Management'
            toolIcon={<UserManagementIcon size="md" />}
            isBordered
        >
        </AppbarBaseForTools>
    );
};

export default UserManagementAppbarBase;
