'use client';

import React, { useTransition } from 'react';
import LoadingButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { createPermissionForManagementUser } from '@/actions/user-management/permissions';
import { toast } from 'sonner';



interface ResourcePermission {
    actions: {
        [key: string]: {
            limiterHint: string;
        };
    };
};

interface PermissionInfos {
    [key: string]: {
        resources: {
            [key: string]: ResourcePermission
        };
    };
}

export const permissionInfos: PermissionInfos = {
    "messaging": {
        resources: {
            "email-templates": {
                actions: {
                    "edit": {
                        limiterHint: 'To specify which email templates the user can read, use the format [{"messageType": "<mtyp>", "studyKey": "<optional>"}]'
                    }
                }
            }
        }
    },
    "study": {
        resources: {
            "*": {
                actions: {
                    "upload_survey": {
                        limiterHint: 'To specify which surveys the user can upload, use the format [{"surveyKey": "<sk1>"}]'
                    }
                }
            }
        }
    }
}



const formSchema = z.object({
    resourceType: z.enum(["study", "messaging"]),
    resourceId: z.string().min(1).trim(),
    action: z.string().min(1),
    limiter: z.string()
})

interface AddPermissionDialogProps {
    userId: string;
}


const AddPermissionDialog: React.FC<AddPermissionDialogProps> = (props) => {
    const dialogCloseRef = React.useRef<HTMLButtonElement>(null);

    const [isPending, startTransition] = useTransition();
    const [resourceIdList, setResourceIdList] = React.useState<string[] | undefined>(undefined)
    const [selectedResourcePermissionInfo, setSelectedResourcePermissionInfo] = React.useState<ResourcePermission | undefined>(undefined)
    const [error, setError] = React.useState<string | undefined>(undefined)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            resourceType: undefined,
            resourceId: "",
            action: "",
            limiter: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setError(undefined)
        startTransition(async () => {
            const resp = await createPermissionForManagementUser(
                props.userId,
                values.resourceType,
                values.resourceId,
                values.action,
                values.limiter
            )
            if (resp.error) {
                setError(resp.error)
                return
            }

            toast('Permission added')

            if (dialogCloseRef.current) {
                dialogCloseRef.current.click()
            }
        })
    }


    const resourceIdFormField = () => {
        if (resourceIdList === undefined) {
            return (<div>
                <p className='text-sm mb-1.5'>Resource ID</p>
                <p className='text-sm px-3 py-2 text-neutral-400 border rounded-md -'>
                    Select a resource type first
                </p>
            </div>)
        }

        if (resourceIdList.length === 0) {
            return (<FormField
                control={form.control}
                name="resourceId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Resource Type</FormLabel>
                        <FormControl>
                            <Input placeholder='Study key'
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                            Specify the study key or * for all studies.
                        </FormDescription>
                    </FormItem>
                )}
            />)
        }

        return (
            <FormField
                control={form.control}
                name="resourceId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel
                            htmlFor={field.name}
                        >Resource ID</FormLabel>
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
        )

    }

    const actionFormField = () => {
        if (form.getValues('resourceId') === "" || !selectedResourcePermissionInfo) {
            return (<div>
                <p className='text-sm mb-1.5'>Action</p>
                <p className='text-sm px-3 py-2 text-neutral-400 border rounded-md -'>
                    Select a resource first
                </p>
            </div>)
        }
        const actionList = selectedResourcePermissionInfo ? Object.keys(selectedResourcePermissionInfo.actions) : []

        return (
            <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel
                            htmlFor={field.name}
                        >Action</FormLabel>
                        <FormControl>
                            <Select onValueChange={(value) => {
                                form.resetField('limiter')
                                field.onChange(value)
                            }} value={field.value}>
                                <SelectTrigger
                                    id={field.name}
                                >
                                    <SelectValue placeholder="Select an action" />
                                </SelectTrigger>
                                <SelectContent>
                                    {actionList.map((action) => (
                                        <SelectItem key={action} value={action}>{action}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        )
    }

    const limiterFormField = () => {
        if (form.getValues('action') === "") {
            return (<div>
                <p className='text-sm mb-1.5'>Limiter</p>
                <p className='text-sm px-3 py-2 text-neutral-400 border rounded-md -'>
                    Select an action first
                </p>
            </div>)
        }

        const hint = selectedResourcePermissionInfo?.actions[form.getValues('action')].limiterHint;

        return <FormField
            control={form.control}
            name="limiter"
            render={({ field }) => {
                return <FormItem>
                    <FormLabel>Limiter</FormLabel>
                    <FormControl>
                        <Textarea placeholder='Resource and action specific limiter'

                            {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        {hint}
                    </FormDescription>
                    <FormMessage />

                </FormItem>
            }}
        />
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='mt-6'
                    variant={'outline'}
                >
                    <Plus className='size-4 me-2' />
                    Add Permission
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add Permission
                    </DialogTitle>
                    <DialogDescription>
                        Fill out the form to add a new permission to this user.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-6'
                    >
                        <FormField
                            control={form.control}
                            name="resourceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        htmlFor={field.name}
                                    >Resource Type</FormLabel>
                                    <FormControl>
                                        <Select

                                            name={field.name}
                                            onValueChange={(value) => {
                                                if (value === 'study') {
                                                    setResourceIdList([])
                                                    setSelectedResourcePermissionInfo(permissionInfos.study.resources["*"])
                                                } else if (value === 'messaging') {
                                                    setResourceIdList(
                                                        Object.keys(permissionInfos.messaging.resources)
                                                    )
                                                    setSelectedResourcePermissionInfo(undefined)
                                                }
                                                form.resetField('resourceId')
                                                form.resetField('limiter')
                                                form.resetField('action')
                                                field.onChange(value)
                                            }} value={field.value}>
                                            <SelectTrigger id={field.name}>
                                                <SelectValue placeholder="Select a resource type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="study">Study</SelectItem>
                                                <SelectItem value="messaging">Messaging</SelectItem>
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

                        {error && <p
                            role='alert'
                            className='text-red-600 text-sm font-bold'
                        >
                            {error}
                        </p>}


                        <DialogFooter>
                            <DialogClose
                                // className='hidden'
                                ref={dialogCloseRef}
                                asChild
                            >
                                <Button
                                    variant={'outline'}
                                    type='button'
                                >
                                    Cancel
                                </Button>
                            </DialogClose>

                            <LoadingButton
                                isLoading={isPending}
                                type='submit'

                            >
                                Add Permission
                            </LoadingButton>
                        </DialogFooter>
                    </form>

                </Form>

            </DialogContent>
        </Dialog>
    );
};

export default AddPermissionDialog;
