'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/loading-button';
import { toast } from 'sonner';

const confidentialResponseQuerySchema = z.object({
    participantIDs: z.string().min(2),
    keyFilter: z.string().optional(),
})


interface ConfidentialResponseDownloaderProps {
    studyKey: string;
}


const ConfidentialResponseDownloader: React.FC<ConfidentialResponseDownloaderProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();
    const form = useForm<z.infer<typeof confidentialResponseQuerySchema>>({
        resolver: zodResolver(confidentialResponseQuerySchema),
        defaultValues: {
            participantIDs: "",
            keyFilter: "",
        },
    })

    function onSubmit(values: z.infer<typeof confidentialResponseQuerySchema>) {
        const participantIDs = values.participantIDs.split('\n').map((id) => id.trim()).filter((id) => id.length > 0);
        const keyFilter = values.keyFilter;

        startTransition(async () => {
            try {
                const resp = await fetch(`/api/case-management-api/v1/studies/${props.studyKey}/data-exporter/confidential-responses`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        participantIDs,
                        keyFilter,
                    }),
                    next: {
                        revalidate: 0,
                    }
                });
                if (resp.status !== 200) {
                    const error = await resp.json();
                    toast.error('Failed to start export task', { description: `${resp.status} - ${error.error}` });
                    return;
                }
                const responses = await resp.json();

                // save file to disk
                const blob = new Blob([JSON.stringify(responses)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'confidential-responses.json';
                a.click();
                window.URL.revokeObjectURL(url);

                toast.success('Confidential responses downloaded');
            } catch (error) {
                console.error(error);
                toast.error('Failed to download confidential responses');
            }
        })

    }


    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg" >
                    Confidential Response Downloader
                </CardTitle>
                <CardDescription className='text-xs'>
                    These responses are not stored together with the other responses for improved privacy protection. Please handle these responses with care.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="participantIDs"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Participant IDs</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder='Enter participant IDs'
                                        />

                                    </FormControl>
                                    <FormDescription>
                                        One participant ID per line.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="keyFilter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Response key (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="full key of the response item" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        If you want to download only a specific response, enter the full key of the response item.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <LoadingButton type="submit"
                            isLoading={isPending}
                        >Download confidential responses</LoadingButton>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default ConfidentialResponseDownloader;
