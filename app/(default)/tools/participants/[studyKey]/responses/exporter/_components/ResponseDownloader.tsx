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
import LoadingButton from '@/components/loading-button';
import FormDatepicker from '@/components/FormDatepicker';

import { Separator } from '@/components/ui/separator';
import { startResponseExport } from '@/lib/data/responses';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();

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

            const sort = encodeURIComponent('{ "arrivedAt": -1 }');

            try {
                const resp = await startResponseExport(
                    props.studyKey,
                    selectedSurveyKey,
                    exportFormat,
                    keySeparator,
                    queryStartDate,
                    queryEndDate,
                    useShortKeys,
                    sort
                );

                if (resp.error || !resp.task) {
                    setErrorMsg(resp.error);
                    toast.error('Failed to start export task', {
                        description: resp.error,
                    });
                    return;
                }

                setSuccessMsg('Export task started successfully');
                router.push(`/tools/participants/${props.studyKey}/responses/exporter/${resp.task.id}`);


            } catch (e) {
                console.error(e);
                toast.error('Failed to start export task');
            }
        })
    }

    return (
        <Card>
            <CardHeader >
                <CardTitle className="text-lg" >
                    Response Downloader
                </CardTitle>
                <CardDescription className='text-xs'>
                    Query and download responses to your device.
                </CardDescription>

            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent>
                        <div className='space-y-6'>


                            <div className='flex flex-wrap justify-between gap-6'>
                                <FormField
                                    control={form.control}
                                    name="surveyKey"
                                    render={({ field }) => (
                                        <FormItem className='grow'>
                                            <FormLabel>Survey key</FormLabel>

                                            <Select
                                                name={field.name}
                                                onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a survey" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='max-h-80 overflow-y-auto'>
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
                                    name="from"
                                    render={({ field }) => (
                                        <FormItem className='grow'>
                                            <FormLabel>From</FormLabel>

                                            <div>
                                                <FormDatepicker field={field}
                                                    maxDate={new Date()}
                                                />
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
                                            <div className='w-full'>
                                                <FormDatepicker field={field} maxDate={new Date()} />
                                            </div>
                                            <FormDescription className='text-xs'>
                                                Download responses until this date.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Separator />

                            <div className='flex flex-wrap justify-between gap-6 items-end'>

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
                                                Separator used between item key, slot key and optional suffix in exported keys.
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

                    <CardFooter className='flex justify-start'>
                        <LoadingButton
                            type='submit'
                            isLoading={isPending}
                        >
                            <Download className='size-4 me-2' />
                            Start export task
                        </LoadingButton>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
};

export default ResponseDownloader;
