'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { addDays } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import LoadingButton from '@/components/LoadingButton';
import FormDatepicker from '@/components/FormDatepicker';
import { redirect } from 'next/navigation';
import { logout } from '@/actions/auth/logout';

interface ResponseDownloaderProps {
    studyKey: string;
    availableSurveys: string[];
}

const formSchema = z.object({
    surveyKey: z.string().min(1, { message: 'Please select a survey' }),
    exportFormat: z.string(),
    keySeparator: z.string().min(1).max(1),
    from: z.date(),
    until: z.date(),
    shortKeys: z.boolean(),
})

const ResponseDownloader: React.FC<ResponseDownloaderProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);
    const [successMsg, setSuccessMsg] = React.useState<string | undefined>(undefined);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            surveyKey: "",
            exportFormat: "wide",
            keySeparator: "-",
            from: addDays(new Date(), -7),
            until: new Date(),
            shortKeys: true,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setErrorMsg(undefined);
        setSuccessMsg(undefined);

        startTransition(async () => {

            const selectedSurveyKey = values.surveyKey;
            const exportFormat = values.exportFormat;
            const keySeparator = values.keySeparator;
            const queryStartDate = Math.round(values.from.getTime() / 1000);
            const queryEndDate = Math.round(values.until.getTime() / 1000);
            const useShortKeys = values.shortKeys;

            const resp = await fetch(`/api/data/responses?studyKey=${props.studyKey}&surveyKey=${selectedSurveyKey}&from=${queryStartDate}&until=${queryEndDate}&format=${exportFormat}&keySeparator=${keySeparator}&useShortKeys=${useShortKeys}`)
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
            link.download = (fileName || 'responses.csv').replaceAll('"', '');
            link.click();
            setSuccessMsg('Downloaded successfully.');
        })


    }

    return (
        <Card>
            <CardHeader >
                <CardTitle >
                    Response Downloader
                </CardTitle>
                <CardDescription>
                    Query and download responses to your device.
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
                                                    <SelectItem value="">No surveys available in this study</SelectItem>
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
                                            Download responses for this survey.
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
                                                <SelectItem value="wide">CSV (wide)</SelectItem>
                                                <SelectItem value="long">CSV (long)</SelectItem>
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
                                name="keySeparator"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Key separator</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter key separator" {...field} />
                                        </FormControl>
                                        <FormDescription className='text-xs'>
                                            This character will be used to separate parts the slot keys in the output.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='flex flex-col sm:flex-row gap-3'>
                                <FormField
                                    control={form.control}
                                    name="from"
                                    render={({ field }) => (
                                        <FormItem className='grow'>
                                            <FormLabel>From</FormLabel>

                                            <div>
                                                <FormDatepicker field={field} />
                                            </div>

                                            <FormDescription className='text-xs'>
                                                Download responses from this date.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="until"
                                    render={({ field }) => (
                                        <FormItem className='grow'>
                                            <FormLabel>Until</FormLabel>
                                            <div>
                                                <FormDatepicker field={field} />
                                            </div>
                                            <FormDescription className='text-xs'>
                                                Download responses until this date.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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
    );
};

export default ResponseDownloader;
