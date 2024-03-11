'use client';

import LoadingButton from "@/components/LoadingButton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertTriangle, CheckCircle, Download } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { logout } from "@/actions/auth/logout";

interface SurveyInfoDownloaderProps {
    studyKey: string;
    availableSurveys: string[];
}

const languages = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES ? process.env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(',') : [process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en'];

const formSchema = z.object({
    surveyKey: z.string().min(1, { message: 'Please select a survey' }),
    exportFormat: z.enum(
        ['json', 'csv'],
    ),
    language: z.string().min(2),
    shortKeys: z.boolean(),
})

const SurveyInfoDownloader: React.FC<SurveyInfoDownloaderProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);
    const [successMsg, setSuccessMsg] = React.useState<string | undefined>(undefined);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            surveyKey: "",
            exportFormat: "json",
            language: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
            shortKeys: true,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setErrorMsg(undefined);
        setSuccessMsg(undefined);
        startTransition(async () => {
            const selectedSurveyKey = values.surveyKey;
            const exportFormat = values.exportFormat;
            const language = values.language;
            const useShortKeys = values.shortKeys;

            const queryParams = new URLSearchParams();
            queryParams.append('surveyKey', selectedSurveyKey);
            queryParams.append('format', exportFormat);
            queryParams.append('language', language);
            queryParams.append('shortKeys', useShortKeys ? 'true' : 'false');

            const url = `/api/case-management-api/v1/studies/${props.studyKey}/data-exporter/survey-info?${queryParams.toString()}`;
            const resp = await fetch(url)
            if (resp.status !== 200) {
                if (resp.status === 401) {
                    await logout()
                }
                const err = await resp.json();
                setErrorMsg(err.error);
                return;
            }
            const blob = await resp.blob();
            const fileName = resp.headers.get('Content-Disposition')?.split('filename=')[1];
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = (fileName || `${selectedSurveyKey}_info.${exportFormat}`).replaceAll('"', '');
            link.click();
            setSuccessMsg('Download successful.');
        });
    }

    return (
        <Card>
            <CardHeader >
                <CardTitle >
                    Survey Info Downloader
                </CardTitle>
                <CardDescription>
                    Download the history of the survey structure in a CSV or JSON format. This can be helpful when interpreting the response data.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent>
                        <div className='space-y-6'>


                            <FormField
                                control={form.control}
                                name="surveyKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Survey key</FormLabel>

                                        <Select
                                            name={field.name}
                                            onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a survey" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    props.availableSurveys.length === 0 &&
                                                    <SelectItem value="_">No surveys available in this study</SelectItem>
                                                }
                                                {
                                                    props.availableSurveys.map((surveyKey) => {
                                                        return (
                                                            <SelectItem
                                                                key={surveyKey}
                                                                value={surveyKey}
                                                            >
                                                                {surveyKey}
                                                            </SelectItem>
                                                        );
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>

                                        <FormDescription className='text-xs'>
                                            Download version infos for this survey.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="exportFormat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Export format</FormLabel>

                                        <Select
                                            name={field.name}
                                            onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a format" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="csv">CSV</SelectItem>
                                                <SelectItem value="json">JSON</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <FormDescription className='text-xs'>
                                            Select the format for the downloaded file.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="language"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Language</FormLabel>

                                        <Select
                                            name={field.name}
                                            onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a language" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    languages.map((lang) => {
                                                        return (
                                                            <SelectItem
                                                                key={lang}
                                                                value={lang}
                                                            >
                                                                {lang}
                                                            </SelectItem>
                                                        );
                                                    })
                                                }
                                                <SelectItem value="ignored">Without labels</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <FormDescription className='text-xs'>
                                            Content will be downloaded in this language if available.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="shortKeys"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='flex space-x-3 items-center'>
                                            <FormControl>
                                                <Switch
                                                    name={field.name}
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel>Use short keys</FormLabel>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {errorMsg && <p className='mt-6 flex gap-6 px-6 py-3 bg-red-100 rounded-lg text-red-600 items-center'>
                            <span>
                                <AlertTriangle className='size-5 ' />
                            </span>
                            {errorMsg}
                        </p>}

                        {successMsg && <p className='mt-6 flex gap-6 px-6 py-3 bg-green-100 rounded-lg text-green-600 items-center'>
                            <span>
                                <CheckCircle className='size-5' />
                            </span>
                            {successMsg}
                        </p>}

                    </CardContent>


                    <CardFooter className='flex justify-end'>
                        <LoadingButton
                            type='submit'
                            isLoading={isPending}
                        >
                            <Download className='size-4 me-2' />
                            Download
                        </LoadingButton>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

export default SurveyInfoDownloader;
