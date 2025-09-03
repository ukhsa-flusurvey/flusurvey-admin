'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { permissionSchema, permissionInfos, getHint, getIfHideLimiter, ResourcePermission } from '../../management-users/[userID]/_components/AddPermissionDialog';


export type RequiredPermissionForm = z.infer<typeof permissionSchema>;

interface AddRequiredPermissionDialogProps {
    onAdd: (permission: RequiredPermissionForm) => void;
}

const AddRequiredPermissionDialog: React.FC<AddRequiredPermissionDialogProps> = (props) => {
    const dialogCloseRef = React.useRef<HTMLButtonElement>(null);

    const [resourceIdList, setResourceIdList] = React.useState<string[] | undefined>(undefined);
    const [selectedResourcePermissionInfo, setSelectedResourcePermissionInfo] = React.useState<ResourcePermission | undefined>(undefined);

    const form = useForm<RequiredPermissionForm>({
        resolver: zodResolver(permissionSchema),
        defaultValues: {
            subjectId: 'template',
            resourceType: undefined as unknown as RequiredPermissionForm['resourceType'],
            resourceId: '',
            action: '',
            limiter: '',
        },
    });

    const onSubmit = (values: RequiredPermissionForm) => {
        props.onAdd(values);
        dialogCloseRef.current?.click();
    };

    const resourceIdFormField = () => {
        if (resourceIdList === undefined) {
            return (
                <div>
                    <p className='text-sm mb-1.5'>Resource Key</p>
                    <p className='text-sm px-3 py-2 text-neutral-400 border rounded-md -'>
                        Select a resource type first
                    </p>
                </div>
            );
        }

        if (resourceIdList.length === 0) {
            return (
                <FormField
                    control={form.control}
                    name='resourceId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Resource Key</FormLabel>
                            <FormControl>
                                <Input placeholder='Study key' {...field} />
                            </FormControl>
                            <FormMessage />
                            <FormDescription>Specify the study key or * for all studies.</FormDescription>
                        </FormItem>
                    )}
                />
            );
        }

        return (
            <FormField
                control={form.control}
                name='resourceId'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor={field.name}>Resource ID</FormLabel>
                        <FormControl>
                            <Select
                                name={field.name}
                                onValueChange={(value) => {
                                    form.resetField('limiter')
                                    form.resetField('action')
                                    if (form.getValues('resourceType') !== 'study') {
                                        setSelectedResourcePermissionInfo(permissionInfos[form.getValues('resourceType')].resources[value])
                                    }
                                    field.onChange(value)
                                }} value={field.value}>
                                <SelectTrigger
                                    id={field.name}
                                >
                                    <SelectValue placeholder="Select a resource ID" />
                                </SelectTrigger>
                                <SelectContent>
                                    {resourceIdList.map((id) => (
                                        <SelectItem key={id} value={id}>{id}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    };

    const actionFormField = () => {
        if (form.getValues('resourceId') === '' || !selectedResourcePermissionInfo) {
            return (
                <div>
                    <p className='text-sm mb-1.5'>Action</p>
                    <p className='text-sm px-3 py-2 text-neutral-400 border rounded-md -'>
                        Select a resource first
                    </p>
                </div>
            );
        }
        const actionList = selectedResourcePermissionInfo ? Object.keys(selectedResourcePermissionInfo.actions) : [];

        return (
            <FormField
                control={form.control}
                name='action'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor={field.name}>Action</FormLabel>
                        <FormControl>
                            <Select
                                onValueChange={(value) => {
                                    form.resetField('limiter');
                                    field.onChange(value);
                                }}
                                value={field.value}
                            >
                                <SelectTrigger id={field.name}>
                                    <SelectValue placeholder='Select an action' />
                                </SelectTrigger>
                                <SelectContent className='max-h-80'>
                                    {actionList.map((action) => (
                                        <SelectItem key={action} value={action}>
                                            {action}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    };

    const limiterFormField = () => {
        if (form.getValues('action') === '') {
            return (
                <div>
                    <p className='text-sm mb-1.5'>Limiter</p>
                    <p className='text-sm px-3 py-2 text-neutral-400 border rounded-md -'>
                        Select an action first
                    </p>
                </div>
            );
        }

        const hint = getHint(form.getValues('resourceType'), form.getValues('resourceId'), form.getValues('action'));
        const hideLimiter = getIfHideLimiter(
            form.getValues('resourceType'),
            form.getValues('resourceId'),
            form.getValues('action')
        );

        if (hideLimiter) {
            return null;
        }

        return (
            <FormField
                control={form.control}
                name='limiter'
                render={({ field }) => {
                    return (
                        <FormItem>
                            <FormLabel>Limiter</FormLabel>
                            <FormControl>
                                <Textarea placeholder='Resource and action specific limiter' {...field} />
                            </FormControl>
                            <FormDescription>{hint}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
        );
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='' variant={'outline'}>
                    <Plus className='size-4 me-2' />
                    Add Permission
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Permission</DialogTitle>
                    <DialogDescription>
                        Fill out the form to add a new required permission to this role.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={(e) => { e.preventDefault(); }}
                        className='space-y-6'>
                        <FormField
                            control={form.control}
                            name='resourceType'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor={field.name}>Resource Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            name={field.name}
                                            onValueChange={(value) => {
                                                if (value === 'study') {
                                                    setResourceIdList([]);
                                                    setSelectedResourcePermissionInfo(permissionInfos.study.resources['*']);
                                                } else if (value === 'messaging') {
                                                    setResourceIdList(Object.keys(permissionInfos.messaging.resources));
                                                    setSelectedResourcePermissionInfo(undefined);
                                                } else if (value === 'users') {
                                                    setResourceIdList(Object.keys(permissionInfos.users.resources));
                                                    setSelectedResourcePermissionInfo(permissionInfos.users.resources['*']);
                                                }
                                                form.resetField('resourceId');
                                                form.resetField('limiter');
                                                form.resetField('action');
                                                field.onChange(value);
                                            }}
                                            value={field.value}
                                        >
                                            <SelectTrigger id={field.name}>
                                                <SelectValue placeholder='Select a resource type' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='study'>Study</SelectItem>
                                                <SelectItem value='messaging'>Messaging</SelectItem>
                                                <SelectItem value='users'>Participant Users</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {resourceIdFormField()}

                        {actionFormField()}

                        {limiterFormField()}

                        <DialogFooter>
                            <DialogClose ref={dialogCloseRef} asChild>
                                <Button variant={'outline'} type='button'>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button type='button' onClick={(e) => { e.stopPropagation(); form.handleSubmit(onSubmit)(); }}>Add Permission</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddRequiredPermissionDialog;


