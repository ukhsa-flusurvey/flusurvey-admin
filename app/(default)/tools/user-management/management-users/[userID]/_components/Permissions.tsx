import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import React from 'react';
import AddPermissionDialog from './AddPermissionDialog';
import { Skeleton } from '@/components/ui/skeleton';
import PermissionActions from './PermissionActions';
import { auth } from '@/auth';
import { fetchCASEManagementAPI } from '@/utils/server/fetch-case-management-api';


interface PermissionsProps {
    userId: string;
}

const CardWrapper: React.FC<{
    children: React.ReactNode;
}> = (props) => {
    return (
        <Card
            variant={"opaque"}
        >
            <TooltipProvider>
                <CardHeader>
                    <h2 className='text-lg font-bold flex items-center'>
                        Permissions
                        <Tooltip
                            delayDuration={0}
                        >
                            <TooltipTrigger>
                                <HelpCircle className='size-4 ms-2' />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Admin users have full access to the system and do not need to be granted permissions.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </h2>
                </CardHeader>
                <CardContent>
                    {props.children}
                </CardContent>
            </TooltipProvider>
        </Card>
    );
}

const getPermissions = async (userId: string) => {
    const session = await auth();
    if (!session || !session.CASEaccessToken) {
        return { error: 'Unauthorized' };
    }
    const url = '/v1/user-management/management-users/' + userId + '/permissions';
    const resp = await fetchCASEManagementAPI(
        url,
        session.CASEaccessToken,
        {
            revalidate: 0,
        }
    );
    if (resp.status !== 200) {
        return { error: `Failed to fetch management user's permissions: ${resp.status} - ${resp.body.error}` };
    }
    return resp.body;
}

const Permissions: React.FC<PermissionsProps> = async (props) => {
    const resp = await getPermissions(props.userId);

    console.log(resp)

    const permissions = resp.permissions;
    const error = resp.error;
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

    if (!permissions || permissions.length === 0) {
        return (
            <CardWrapper>
                <div className='py-3 text-center bg-n-100 rounded-md text-neutral-600'>
                    <h3 className='font-bold'>No permissions added</h3>
                </div>

                <AddPermissionDialog
                    userId={props.userId}
                />
            </CardWrapper>
        );
    }


    return (
        <CardWrapper>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Resource Type</TableHead>
                        <TableHead>Resource Key</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Limiter</TableHead>
                        <TableHead className='text-end'></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {permissions.map((permission: any) => (
                        <TableRow key={permission.id}>
                            <TableCell>
                                {permission.resourceType}
                            </TableCell>
                            <TableCell>
                                {permission.resourceKey}
                            </TableCell>
                            <TableCell>
                                {permission.action}
                            </TableCell>
                            <TableCell>
                                {permission.limiter}
                            </TableCell>
                            <TableCell>
                                <PermissionActions permission={permission} />
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>

            <AddPermissionDialog
                userId={props.userId}
            />
        </CardWrapper >
    );
};

export default Permissions;

export const PermissionsSkeleton: React.FC = () => {
    return (
        <CardWrapper>
            <div className='space-y-2'>
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
            </div>


            <Skeleton className='h-10 w-40 mt-6' />
        </CardWrapper>
    );
}
