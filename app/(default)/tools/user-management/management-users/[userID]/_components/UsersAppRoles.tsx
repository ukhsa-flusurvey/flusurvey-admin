import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowRight, HelpCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getAppRoleTemplates, getManagementUserAppRoles, ManagementUserAppRole, getPermissions, ManagementUserPermission, AppRoleTemplate } from '@/lib/data/userManagementAPI';
import UsersAppRoleActions from './UsersAppRoleActions';
import AssignAppRoleButton from './AssignAppRoleButton';
import { Button } from '@/components/ui/button';

interface UsersAppRolesProps {
    userId: string;
}

const CardWrapper: React.FC<{ children: React.ReactNode; }> = (props) => {
    return (
        <Card
            variant={"opaque"}
        >
            <TooltipProvider>
                <CardHeader>
                    <h2 className='text-lg font-bold flex items-center'>
                        App Roles
                        <Tooltip
                            delayDuration={0}
                        >
                            <TooltipTrigger>
                                <HelpCircle className='size-4 ms-2' />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className='max-w-xs'>
                                    The following app roles are assigned to this user. Assigning an app role grants its required permissions initially, but does not grant permissions on future app role updates.
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

const PermissionWarningPopover: React.FC<{ role: ManagementUserAppRole, templates: AppRoleTemplate[], userPermissions: ManagementUserPermission[] }> = ({ role, templates, userPermissions }) => {
    const getMissingPermissions = (role: ManagementUserAppRole): ManagementUserPermission[] => {
        const template = templates.find(t => t.appName === role.appName && t.role === role.role);
        if (!template) return [];

        return template.requiredPermissions.filter((requiredPerm: ManagementUserPermission) =>
            !userPermissions.some((userPerm: ManagementUserPermission) =>
                userPerm.resourceType === requiredPerm.resourceType &&
                userPerm.resourceKey === requiredPerm.resourceKey &&
                userPerm.action === requiredPerm.action &&
                (!userPerm.limiter || JSON.stringify(userPerm.limiter || {}) === JSON.stringify(requiredPerm.limiter || {}))
            )
        );
    };
    const missingPermissions = getMissingPermissions(role);
    if (missingPermissions.length === 0) return null;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    title="Missing permissions for this role"
                >
                    <AlertTriangle className="size-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
                <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-amber-800">Missing Permissions</h4>
                    <p className="text-sm text-gray-600">
                        This user is missing {missingPermissions.length} permission{missingPermissions.length === 1 ? '' : 's'} required for the <strong>{role.role}</strong> role in <strong>{role.appName}</strong>.
                    </p>
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Missing permissions:</p>
                        <ul className="text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                            {missingPermissions.map((perm, index) => (
                                <li key={perm.id ?? index} className="flex flex-col bg-gray-100 p-1 rounded-md">
                                    <span className="font-mono  px-1 py-0.5 rounded">
                                        {perm.resourceType}:{perm.resourceKey}:{perm.action}
                                    </span>
                                    {perm.limiter && Object.keys(perm.limiter).length > 0 && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            Limiter:
                                            <pre className='font-mono p-1'>{JSON.stringify(perm.limiter, undefined, 2)}</pre>
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="pt-2 border-t">
                        <p className="text-xs text-gray-600">
                            <strong>Fix:</strong> Remove and re-add this role to grant all required permissions.
                        </p>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

const UsersAppRoles: React.FC<UsersAppRolesProps> = async (props) => {
    const [rolesResp, templatesResp, permissionsResp] = await Promise.all([
        getManagementUserAppRoles(props.userId),
        getAppRoleTemplates(),
        getPermissions(props.userId),
    ]);

    if (rolesResp.error) {
        return (
            <CardWrapper>
                <div className='px-6 py-3 bg-red-100 rounded-md text-red-700'>
                    <h3 className='font-bold'>Unexpected error: </h3>
                    {rolesResp.error}
                </div>
            </CardWrapper>
        );
    }

    const appRoles = rolesResp.appRoles || [];
    const templates = templatesResp.appRoleTemplates || [];
    const userPermissions = permissionsResp.permissions || [];
    const assignedKeys = new Set(appRoles.map(r => `${r.appName}:${r.role}`));
    const unassignedTemplates = templates.filter(t => !assignedKeys.has(`${t.appName}:${t.role}`));

    const renderAssignedAppRoles = () => {
        if (appRoles.length === 0) {
            return (
                <div className='py-3 text-center bg-n-100 rounded-md text-neutral-600'>
                    <h3 className='font-bold'>No app roles assigned</h3>
                </div>
            );
        }

        return (
            <Table className='bg-white rounded-lg overflow-hidden'>
                <TableHeader>
                    <TableRow className='bg-slate-50'>
                        <TableHead className='text-start w-2/5'>Assigned at</TableHead>
                        <TableHead className='text-center w-2/5'>Role</TableHead>
                        <TableHead className='text-end w-1/5'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(appRoles.reduce((acc, role) => {
                        const key = role.appName || 'Unknown app';
                        if (!acc[key]) acc[key] = [] as ManagementUserAppRole[];
                        acc[key].push(role);
                        return acc;
                    }, {} as Record<string, ManagementUserAppRole[]>)).sort((a, b) => a[0].localeCompare(b[0])).map(([app, roles]) => (
                        <React.Fragment key={app}>
                            <TableRow>
                                <TableCell colSpan={3} className='bg-slate-50 py-1'>
                                    <span className='font-bold'>{app}</span>
                                </TableCell>
                            </TableRow>
                            {roles.sort((a, b) => {
                                const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                                const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                                return tb - ta;
                            }).map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className='text-sm text-neutral-600'>
                                        {role.createdAt ? new Date(role.createdAt).toLocaleString() : '-'}
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        <Badge variant={'outline'}>
                                            {role.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className='text-end'>
                                        <div className='flex items-center justify-end gap-1'>
                                            <PermissionWarningPopover
                                                templates={templates}
                                                userPermissions={userPermissions}
                                                role={role} />
                                            {role.id && (
                                                <UsersAppRoleActions
                                                    userId={props.userId}
                                                    appRoleId={role.id}
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        )
    }

    return (
        <CardWrapper>
            {renderAssignedAppRoles()}

            <div className='flex justify-start mt-6 items-center gap-2'>
                <AssignAppRoleButton userId={props.userId} templates={unassignedTemplates}
                    disabled={unassignedTemplates.length === 0}
                />
                {unassignedTemplates.length === 0 && (
                    <div className='text-sm text-muted-foreground'>

                        <span>No further app roles available to assign.</span>
                        <Button
                            variant={'link'}
                            asChild
                        >
                            <Link href={`/tools/user-management/app-roles`}>
                                Manage app role templates
                                <ArrowRight className='size-4' />
                            </Link>
                        </Button>

                    </div>
                )}
            </div>
        </CardWrapper>
    );
};

export default UsersAppRoles;

export const UsersAppRolesSkeleton: React.FC = () => {
    return (
        <CardWrapper>
            <div className='space-y-2'>
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
            </div>

        </CardWrapper>
    );
}


