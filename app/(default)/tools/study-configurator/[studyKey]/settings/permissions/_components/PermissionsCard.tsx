import React from 'react';
import WrapperCard from '../../_components/WrapperCard';
import { getStudyPermissions } from '@/lib/data/studyAPI';
import ErrorAlert from '@/components/ErrorAlert';
import AddStudyPermissions from './AddStudyPermissions';
import { getManagementUsers } from '@/lib/data/userManagementAPI';
import { toast } from 'sonner';
import PermissionsEditor from './PermissionsEditor';
import { Skeleton } from '@/components/ui/skeleton';
import { ManagementUser } from '@/app/(default)/tools/user-management/management-users/_components/ListItem';

interface PermissionsCardProps {
    studyKey: string;
}

const PermissionsCard: React.FC<PermissionsCardProps> = async (props) => {
    const resp = await getStudyPermissions(props.studyKey);
    const error = resp.error;
    const permissions = resp.permissions;


    let content: React.ReactNode | null = null;
    if (error) {
        content = <ErrorAlert
            title="Failed to fetch permissions"
            error={error}
        />;
    } else if (!permissions || Object.keys(permissions).length === 0) {
        content = (
            <div className='pb-6'>
                <p className='text-neutral-600'>
                    No permissions found
                </p>
            </div>
        );
    } else {
        content = (
            <PermissionsEditor
                studyKey={props.studyKey}
                permissions={permissions}
            />
        );
    }

    const usersResp = await getManagementUsers();
    const users = (usersResp.users || []).sort((a: ManagementUser, b: ManagementUser) => {
        return a.username.localeCompare(b.username);
    });

    if (usersResp.error) {
        toast.error('Failed to fetch users', {
            description: usersResp.error
        });
    }

    return (
        <WrapperCard
            title="Permissions"
            description='The following users have explicit permissions to this study. (Admins or users with access to all studies are not listed here)'
        >
            {content}

            <AddStudyPermissions
                studyKey={props.studyKey}
                users={users}
                permissions={permissions}
            />
        </WrapperCard>
    );
};

export default PermissionsCard;

export const PermissionsCardSkeleton: React.FC = () => {
    return (
        <WrapperCard
            title="Permissions"
            description='The following users have explicit permissions to this study. (Admins or users with access to all studies are not listed here)'
        >
            <div className='space-y-3'>
                <Skeleton className='w-full h-40' />
                <Skeleton className='w-full h-40' />
                <Skeleton className='w-36 h-10' />
            </div>
        </WrapperCard>
    );
};
