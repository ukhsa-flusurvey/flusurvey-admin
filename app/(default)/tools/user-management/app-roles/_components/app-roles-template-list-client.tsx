"use client";

import React, { useMemo, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Copy as ClipboardIcon, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AppRoleEditorDialog from './app-role-editor-dialog';
import { AppRoleTemplate } from '@/lib/data/userManagementAPI';
import { deleteAppRoleTemplateAction, deleteAppRoleTemplatesForAppAction, updateAppRoleTemplateAction } from '@/actions/user-management/app-role-templates';
import { createEnvelope } from '@/utils/clipboardEnvelope';

interface AppRolesTemplateListClientProps {
    templates: AppRoleTemplate[];
}

const AppRolesTemplateListClient: React.FC<AppRolesTemplateListClientProps> = (props) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorError, setEditorError] = useState<string | undefined>(undefined);
    const [editingTemplate, setEditingTemplate] = useState<AppRoleTemplate | undefined>(undefined);

    const grouped = useMemo(() => {
        const map = props.templates.reduce((acc, t) => {
            const key = t.appName || 'Unknown App';
            if (!acc[key]) acc[key] = [] as AppRoleTemplate[];
            acc[key].push(t);
            return acc;
        }, {} as Record<string, AppRoleTemplate[]>);
        return Object.entries(map)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([appName, items]) => ({
                appName,
                items: items.slice().sort((a, b) => a.role.localeCompare(b.role)),
            }));
    }, [props.templates]);

    const onEdit = (template: AppRoleTemplate) => {
        setEditingTemplate(template);
        setEditorError(undefined);
        setEditorOpen(true);
    };

    const onSubmitEdit = (values: AppRoleTemplate) => {
        if (!editingTemplate?.id) return;
        startTransition(async () => {
            const resp = await updateAppRoleTemplateAction(editingTemplate.id as string, values);
            if ('error' in resp && resp.error) {
                setEditorError(resp.error);
                return;
            }
            setEditorError(undefined);
            setEditorOpen(false);
            toast.success('App role updated');
            router.refresh();
        });
    };

    const onDelete = (template: AppRoleTemplate) => {
        if (!template.id) return;
        if (!confirm(`Delete role "${template.role}" from ${template.appName}?`)) return;
        startTransition(async () => {
            const resp = await deleteAppRoleTemplateAction(template.id as string);
            if ('error' in resp && resp.error) {
                toast.error(resp.error);
                return;
            }
            toast.success('App role deleted');
            router.refresh();
        });
    };

    const onCopy = async (template: AppRoleTemplate) => {
        try {
            const copiedTemplate = {
                ...template,
            }
            delete copiedTemplate.id;
            const envelope = createEnvelope('app-role-template', copiedTemplate);
            await navigator.clipboard.writeText(JSON.stringify(envelope, null, 2));
            toast.success('Copied app role template to clipboard');
        } catch {
            toast.error('Failed to copy to clipboard');
        }
    };

    const onDeleteAll = (appName: string) => {
        if (!confirm(`Delete ALL role templates for ${appName}? This cannot be undone.`)) return;
        startTransition(async () => {
            const resp = await deleteAppRoleTemplatesForAppAction(appName);
            if ('error' in resp && resp.error) {
                toast.error(resp.error);
                return;
            }
            toast.success(`All templates for ${appName} deleted`);
            router.refresh();
        });
    };

    return (
        <div className='space-y-6'>
            {grouped.map(({ appName, items }) => (
                <section key={appName} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                        <h3 className='text-md font-semibold'>
                            {appName}
                        </h3>
                        <div className='flex items-center gap-2'>

                            <Button
                                type='button'
                                variant={'ghost'}
                                size={'sm'}
                                onClick={() => onDeleteAll(appName)}
                                disabled={isPending}
                            >
                                <span className="text-red-600">
                                    Delete all
                                </span>
                            </Button>
                        </div>
                    </div>
                    <ul className='divide-y rounded-md border border-gray-200 bg-white'>
                        {items.map((t) => (
                            <li key={t.id ?? `${appName}-${t.role}`} className='flex items-center justify-between px-2 py-3'>
                                <div className='block space-x-2'>
                                    <span className='font-medium'>{t.role}</span>
                                    <span className='text-xs text-neutral-600'>({t.requiredPermissions?.length ?? 0} permissions)</span>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <Button type='button' variant={'ghost'} size={'icon'} onClick={() => onCopy(t)} disabled={isPending}>
                                        <ClipboardIcon className='size-4' />
                                    </Button>
                                    <Button type='button' variant={'ghost'} size={'icon'} onClick={() => onEdit(t)} disabled={isPending}>
                                        <Pencil className='size-4' />
                                    </Button>
                                    <Button type='button' variant={'ghost'} size={'icon'} onClick={() => onDelete(t)} disabled={isPending}>
                                        <Trash2 className='size-4 text-red-600' />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}

            <AppRoleEditorDialog
                isOpen={editorOpen}
                onClose={() => setEditorOpen(false)}
                onSubmit={onSubmitEdit}
                title={editingTemplate ? `Edit ${editingTemplate.role}` : 'Edit role'}
                description={editingTemplate ? `Update the role template for ${editingTemplate.appName}.` : ''}
                isLoading={isPending}
                error={editorError}
                initialValue={editingTemplate}
            />
        </div>
    );
};

export default AppRolesTemplateListClient;


