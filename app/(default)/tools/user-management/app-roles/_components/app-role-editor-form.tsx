'use client';

import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { FormControl, FormMessage } from "@/components/ui/form";

import { Form, FormItem, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AppRoleTemplate, ManagementUserPermission } from "@/lib/data/userManagementAPI";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { permissionSchema } from "../../management-users/[userID]/_components/AddPermissionDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import AddRequiredPermissionDialog, { RequiredPermissionForm } from "./AddRequiredPermissionDialog";


interface AppRoleEditorFormProps {
    initialValue?: AppRoleTemplate;
    onSubmit: (values: AppRoleTemplate) => void;
    onCancel: () => void;
    isLoading: boolean;
    error: string | undefined;
}

const baseSchema = z.object({
    appName: z.string().min(1, 'App name is required').trim(),
    role: z.string().min(1, 'Role is required').trim(),
    requiredPermissions: z.array(permissionSchema),
});


const AppRoleEditorForm = (props: AppRoleEditorFormProps) => {
    const form = useForm<z.infer<typeof baseSchema>>({
        resolver: zodResolver(baseSchema),
        defaultValues: {
            appName: props.initialValue?.appName ?? '',
            role: props.initialValue?.role ?? '',
            requiredPermissions: (props.initialValue?.requiredPermissions ?? []).map((p) => ({
                subjectId: 'template',
                resourceType: p.resourceType as RequiredPermissionForm['resourceType'],
                resourceId: p.resourceKey,
                action: p.action,
                limiter: p.limiter ? JSON.stringify(p.limiter) : "",
            } satisfies RequiredPermissionForm)),
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'requiredPermissions',
    });

    const onSubmit = async (values: z.infer<typeof baseSchema>) => {
        const newValues = {
            appName: values.appName,
            role: values.role,
            requiredPermissions: values.requiredPermissions.map(permission => {
                return {
                    resourceType: permission.resourceType,
                    resourceKey: permission.resourceId,
                    action: permission.action,
                    limiter: permission.limiter === "" ? undefined : JSON.parse(permission.limiter),
                }
            }) as ManagementUserPermission[],
        }
        props.onSubmit(newValues);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid gap-4 md:grid-cols-2'>
                    <FormField
                        control={form.control}
                        name='appName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor={field.name}>App name</FormLabel>
                                <FormControl>
                                    <Input placeholder='e.g., study-nurse-app' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='role'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor={field.name}>Role</FormLabel>
                                <FormControl>
                                    <Input placeholder='e.g., data-manager' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='space-y-3'>
                    <div>
                        <h3 className='font-medium'>Required permissions</h3>
                        <p className='text-xs text-neutral-600'>
                            When adding this role to a user, they will be granted all the permissions listed here.
                        </p>
                    </div>

                    {fields.length === 0 ? (
                        <div className='py-3 text-center bg-n-100 rounded-md text-neutral-600'>
                            <h3 className='font-bold'>No required permissions added</h3>
                        </div>
                    ) : (
                        <Table className='bg-white rounded-lg overflow-hidden'>
                            <TableHeader>
                                <TableRow className='bg-slate-50'>
                                    <TableHead>Resource</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Limiter</TableHead>
                                    <TableHead className='text-end'></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell>
                                            <Badge variant={'outline'}>
                                                {form.getValues(`requiredPermissions.${index}.resourceType`)}
                                            </Badge>
                                            <p className='font-bold px-3 mt-1'>
                                                {form.getValues(`requiredPermissions.${index}.resourceId`)}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            {form.getValues(`requiredPermissions.${index}.action`)}
                                        </TableCell>
                                        <TableCell className='text-xs font-mono'>
                                            {(() => {
                                                const limiter = form.getValues(`requiredPermissions.${index}.limiter`);
                                                return limiter ? limiter : '';
                                            })()}
                                        </TableCell>
                                        <TableCell className='text-end'>
                                            <Button type='button' variant={'ghost'} size={'icon'} onClick={() => remove(index)}>
                                                <X className='size-4' />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    <div className="flex justify-center">
                        <AddRequiredPermissionDialog
                            onAdd={(permission) => {
                                append(permission);
                            }}
                        />
                    </div>
                </div>

                {props.error && (
                    <p role='alert' className='text-red-600 text-sm font-medium'>
                        {props.error}
                    </p>
                )}

                <div className='flex justify-end gap-2'>
                    <Button type='button' variant='outline' onClick={props.onCancel}>
                        Cancel
                    </Button>
                    <LoadingButton type='submit' isLoading={props.isLoading}>
                        {props.initialValue ? 'Save changes' : 'Create template'}
                    </LoadingButton>
                </div>
            </form>
        </Form>
    )
}

export default AppRoleEditorForm
