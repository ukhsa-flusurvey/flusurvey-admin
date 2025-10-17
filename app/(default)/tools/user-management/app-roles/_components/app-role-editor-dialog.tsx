"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import AppRoleEditorForm from './app-role-editor-form';
import { AppRoleTemplate } from '@/lib/data/userManagementAPI';

interface AppRoleEditorDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: AppRoleTemplate) => void;
    title: string;
    description: string;
    isLoading: boolean;
    error: string | undefined;
    initialValue: AppRoleTemplate | undefined;
}

const AppRoleEditorDialog: React.FC<AppRoleEditorDialogProps> = (props) => {
    return (
        <Dialog open={props.isOpen} onOpenChange={props.onClose}>
            <DialogContent className='max-w-3xl max-h-full overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>{props.title}</DialogTitle>
                    <DialogDescription>{props.description}</DialogDescription>
                </DialogHeader>
                <AppRoleEditorForm
                    onSubmit={props.onSubmit}
                    onCancel={props.onClose}
                    isLoading={props.isLoading}
                    error={props.error}
                    initialValue={props.initialValue}
                />
            </DialogContent>
        </Dialog>
    )
}

export default AppRoleEditorDialog;
