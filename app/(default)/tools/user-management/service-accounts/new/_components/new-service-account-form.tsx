'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"


import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createServiceAccount } from "@/lib/data/service-accounts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/loading-button";

const newServiceAccountFormSchema = z.object({
    label: z.string().min(2),
    description: z.string().optional(),
})

const NewServiceAccountForm: React.FC = () => {
    const [isPending, startTransition] = React.useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof newServiceAccountFormSchema>>({
        resolver: zodResolver(newServiceAccountFormSchema),
        defaultValues: {
            label: "",
            description: "",
        },
    })

    const onSubmit = (values: z.infer<typeof newServiceAccountFormSchema>) => {

        startTransition(async () => {
            try {
                const resp = await createServiceAccount(values.label, values.description);
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                toast.success('Service account created');
                router.push(`/tools/user-management/service-accounts`);
            } catch (error) {
                console.error(error);
                toast.error('Failed to create service account');
            }
        });
    }

    return (
        <Card className="p-6 max-w-2xl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    The label of the service account.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormDescription>
                                    Optional description of the service account to help users understand what it is used for.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-2">
                        <LoadingButton type="submit"
                            isLoading={isPending}
                        >
                            Create
                        </LoadingButton>
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                        >
                            <Link
                                href={"/tools/user-management/service-accounts"}
                            >
                                Cancel
                            </Link>
                        </Button>
                    </div>
                </form>
            </Form>
        </Card>
    );
};

export default NewServiceAccountForm;
