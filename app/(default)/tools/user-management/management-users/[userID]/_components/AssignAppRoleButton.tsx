'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { BeatLoader } from 'react-spinners';
import { assignAppRoleToManagementUserAction } from '@/actions/user-management/app-roles';
import type { AppRoleTemplate, ManagementUserPermission } from '@/lib/data/userManagementAPI';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AssignAppRoleButtonProps {
    userId: string;
    templates: Array<AppRoleTemplate>;
}

const PermissionItem: React.FC<{ permission: ManagementUserPermission }> = ({ permission }) => {
    const limiterText = permission.limiter ? ` limiter=${JSON.stringify(permission.limiter)}` : '';
    return (
        <div className='text-sm text-neutral-700 py-1'>
            <Badge variant={'outline'}
                className='me-2'
            >
                <span className='font-normal'>
                    {permission.resourceType}
                </span>
                <span className='ps-3 font-bold text-sm'>
                    {permission.resourceKey}
                </span>
            </Badge>
            <span className='font-mono'>
                {permission.action}
            </span>
            <span className='font-mono text-xs pre'>
                {limiterText}
            </span>
        </div>
    );
}

const AssignAppRoleButton: React.FC<AssignAppRoleButtonProps> = (props) => {
    const [open, setOpen] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined);
    const [isPending, startTransition] = useTransition();

    const groupedTemplates = useMemo(() => {
        const byApp: Record<string, Array<AppRoleTemplate>> = {};
        for (const tpl of props.templates) {
            const key = tpl.appName || 'Unknown App';
            if (!byApp[key]) byApp[key] = [];
            byApp[key].push(tpl);
        }
        // sort apps and roles for nicer UX
        Object.values(byApp).forEach(arr => arr.sort((a, b) => (a.role || '').localeCompare(b.role || '')));
        return Object.entries(byApp).sort((a, b) => a[0].localeCompare(b[0]));
    }, [props.templates]);

    const selectedTemplate = useMemo(() => props.templates.find(t => t.id === selectedTemplateId), [props.templates, selectedTemplateId]);

    const onConfirm = () => {
        if (!selectedTemplateId) return;
        startTransition(async () => {
            const resp = await assignAppRoleToManagementUserAction(props.userId, selectedTemplateId);
            if ('error' in resp && resp.error) {
                toast.error(resp.error);
                return;
            }
            toast.success('App role assigned');
            setOpen(false);
            setSelectedTemplateId(undefined);
        });
    }

    const numPermissions = selectedTemplate?.requiredPermissions?.length || 0;

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!isPending) setOpen(v); }}>
            <DialogTrigger asChild>
                <Button
                    variant={'outline'}
                >
                    <Plus className='size-4 me-2' />
                    Assign app role
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader>
                    <DialogTitle>Assign app role</DialogTitle>
                    <DialogDescription>
                        Choose an app role template to assign to this user.
                    </DialogDescription>
                </DialogHeader>
                <div className='space-y-3'>
                    <div className='grid gap-2'>
                        <Label>Template</Label>
                        <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select a template' />
                            </SelectTrigger>
                            <SelectContent>
                                {groupedTemplates.map(([app, tpls]) => (
                                    <SelectGroup key={app}>
                                        <SelectLabel>{app}</SelectLabel>
                                        {tpls.map(tpl => (
                                            <SelectItem key={tpl.id} value={tpl.id!}>
                                                {tpl.role}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedTemplate && (
                        <div className='rounded-md border p-3 bg-slate-50'>
                            <div className='text-sm text-neutral-800 mb-2'>
                                This will add <b>{numPermissions}</b> permission{numPermissions === 1 ? '' : 's'} to the user:
                            </div>
                            <ScrollArea className='h-40 rounded'>
                                <div className='pr-2 divide-y divide-neutral-200'>
                                    {(selectedTemplate.requiredPermissions || []).map((p) => (
                                        <PermissionItem key={p.id + ':' + p.action} permission={p} />
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>
                <DialogFooter className='justify-between sm:justify-end gap-2'>
                    <BeatLoader loading={isPending} />
                    <Button variant={'secondary'} onClick={() => setOpen(false)} disabled={isPending}>Cancel</Button>
                    <Button onClick={onConfirm} disabled={!selectedTemplateId || isPending}>Assign</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AssignAppRoleButton;


