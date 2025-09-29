import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import React from 'react';
import AddPermissionDialog from './AddPermissionDialog';
import { Skeleton } from '@/components/ui/skeleton';
import PermissionActions from './PermissionActions';
import { Badge } from '@/components/ui/badge';
import { ManagementUserPermission, getAppRoleTemplates, getManagementUserAppRoles, getPermissions } from '@/lib/data/userManagementAPI';
import RemoveNonRolePermissionsButton from './RemoveNonRolePermissions';


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



const Permissions: React.FC<PermissionsProps> = async (props) => {
    const resp = await getPermissions(props.userId);
    const appRoleTemplatesResp = await getAppRoleTemplates();
    const userRolesResp = await getManagementUserAppRoles(props.userId);

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

    const getAppRolesForPermission = (permission: ManagementUserPermission) => {
        const userRoles = userRolesResp.appRoles || [];
        const templatesUsedOnUser = appRoleTemplatesResp.appRoleTemplates?.filter(t => userRoles.some(r => r.appName === t.appName && r.role === t.role));
        return templatesUsedOnUser?.filter(t => t.requiredPermissions.some(p => p.resourceType === permission.resourceType && p.resourceKey === permission.resourceKey && p.action === permission.action && (JSON.stringify(p.limiter) === JSON.stringify(permission.limiter) || !permission.limiter)));
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


    const orphanPermissions = permissions.filter((permission: ManagementUserPermission) => (getAppRolesForPermission(permission)?.length ?? 0) === 0);

    return (
        <CardWrapper>
            <Table className='bg-white rounded-lg overflow-hidden'>
                <TableHeader>
                    <TableRow className='bg-slate-50'>
                        <TableHead>Resource</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Limiter</TableHead>
                        <TableHead>Required for app role</TableHead>
                        <TableHead className='text-end'></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {permissions.map((permission: ManagementUserPermission) => (
                        <TableRow key={permission.id}>
                            <TableCell className=''>
                                <Badge
                                    variant={'outline'}
                                >
                                    {permission.resourceType}
                                </Badge>
                                <p className='font-bold px-3 mt-1'>{permission.resourceKey}</p>

                            </TableCell>

                            <TableCell>
                                {permission.action}
                            </TableCell>
                            <TableCell
                                className='text-xs font-mono'
                            >
                                {permission.limiter && (
                                    <pre className='text-xs font-mono whitespace-pre-wrap max-h-20 overflow-y-auto bg-slate-100 p-2 rounded-md'>
                                        {JSON.stringify(permission.limiter, null, 1)}
                                    </pre>
                                )}
                            </TableCell>
                            <TableCell className='gap-2 flex flex-wrap'>
                                {getAppRolesForPermission(permission)?.map(template => {
                                    return (
                                        <span key={template.id}
                                            className='px-2 py-0.5 text-xs rounded-full bg-slate-100 border border-border truncate'
                                        >
                                            <span className='font-normal'>{template.appName}</span>/
                                            <span className='font-bold'>{template.role}</span>
                                        </span>
                                    )
                                })}

                            </TableCell>
                            <TableCell>
                                <PermissionActions
                                    userId={props.userId}
                                    permission={permission}
                                    userType='management-user'
                                />
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>

            <div className='flex justify-between gap-2 mt-6'>
                <AddPermissionDialog
                    userId={props.userId}
                    userType='management-user'
                />
                {orphanPermissions.length > 0 && (
                    <RemoveNonRolePermissionsButton
                        userId={props.userId}
                        permissions={orphanPermissions}
                    />
                )}
            </div>
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
