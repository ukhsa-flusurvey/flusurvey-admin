import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import React from 'react';
import AddPermissionDialog from './AddPermissionDialog';
import { Skeleton } from '@/components/ui/skeleton';

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
    // TODO: load permissions

    const permissions: any[] = [];
    const error = undefined;
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

                <AddPermissionDialog />
            </CardWrapper>
        );
    }


    return (
        <CardWrapper>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <AddPermissionDialog />
        </CardWrapper>
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
