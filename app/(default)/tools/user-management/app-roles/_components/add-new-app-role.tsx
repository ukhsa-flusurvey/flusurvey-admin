'use client';

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AppRoleEditorDialog from "./app-role-editor-dialog";
import { useState, useTransition } from "react";
import { AppRoleTemplate } from "@/lib/data/userManagementAPI";
import { createAppRoleTemplate } from "@/lib/data/userManagementAPI";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const AddNewAppRole = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>(undefined);
    const router = useRouter();

    const onSubmit = (values: AppRoleTemplate) => {
        startTransition(async () => {
            console.log('submit', values);
            const resp = await createAppRoleTemplate(values);
            if (resp.error) {
                setError(resp.error);
                console.error(resp.error);
                return;
            }
            setError(undefined);
            toast.success('App role created successfully');
            setIsOpen(false);
            router.refresh();
        });
    }

    return (
        <div>
            <Button
                variant={'outline'}
                size={'icon'}
                onClick={() => setIsOpen(true)}
            >
                <PlusIcon className='size-4' />
            </Button>
            <AppRoleEditorDialog
                isOpen={isOpen}
                title="Create a new App Role"
                description="Create a new app role to add or remove permissions."
                initialValue={undefined}
                onClose={() => setIsOpen(false)}
                onSubmit={onSubmit}
                isLoading={isPending}
                error={error}
            />
        </div>
    )
}

export default AddNewAppRole;
