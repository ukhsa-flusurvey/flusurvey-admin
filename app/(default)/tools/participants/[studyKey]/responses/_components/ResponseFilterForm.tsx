'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormDatepicker from '@/components/FormDatepicker';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';


const responseFilterSchema = z.object({
    surveyKey: z.string().min(1),
    laterThan: z.date().optional(),
    earlierThan: z.date().optional()
})

interface ResponseFilterFormProps {
    surveyKeys: string[];
}

const ResponseFilterForm: React.FC<ResponseFilterFormProps> = (props) => {
    const submitBtnRef = React.useRef<HTMLButtonElement>(null);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [showDateFilter, setShowDateFilter] = React.useState<boolean>(
        searchParams.has('laterThan') || searchParams.has('earlierThan')
    );

    const form = useForm<z.infer<typeof responseFilterSchema>>({
        resolver: zodResolver(responseFilterSchema),
        defaultValues: {
            surveyKey: searchParams.get('surveyKey') || '',
        },
        values: {
            surveyKey: searchParams.get('surveyKey') || '',
            laterThan: searchParams.get('laterThan') ? new Date(parseInt(searchParams.get('laterThan')!) * 1000) : undefined,
            earlierThan: searchParams.get('earlierThan') ? new Date(parseInt(searchParams.get('earlierThan')!) * 1000) : undefined,
        }
    });

    function onSubmit(values: z.infer<typeof responseFilterSchema>) {
        const params = new URLSearchParams(searchParams);
        if (values.surveyKey) {
            params.set('surveyKey', values.surveyKey);
        } else {
            params.delete('surveyKey');
        }

        if (values.laterThan) {
            params.set('laterThan', (values.laterThan.getTime() / 1000).toFixed(0));
        } else {
            params.delete('laterThan');
        }

        if (values.earlierThan) {
            params.set('earlierThan', (values.earlierThan.getTime() / 1000).toFixed(0));
        } else {
            params.delete('earlierThan');
        }

        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
            >
                <div className='flex gap-4 justify-between items-end'>
                    <FormField
                        control={form.control}
                        name="surveyKey"
                        render={({ field }) => (
                            <FormItem
                                className="w-80"
                            >
                                <FormLabel>Survey Key</FormLabel>

                                <Select
                                    name="surveyKey"
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        submitBtnRef.current?.click();
                                    }}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a survey ..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent

                                    >
                                        <ScrollArea className="h-40 overflow-y-auto">
                                            {props.surveyKeys.map((surveyKey) => (
                                                <SelectItem key={surveyKey} value={surveyKey}>{surveyKey}</SelectItem>
                                            ))}
                                            <ScrollBar />
                                        </ScrollArea>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='flex items-center gap-2 pb-2'>
                        <Switch
                            id="date-filter"
                            name="date-filter"
                            checked={showDateFilter}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    setShowDateFilter(true);
                                } else {
                                    form.setValue('laterThan', undefined);
                                    form.setValue('earlierThan', undefined);
                                    submitBtnRef.current?.click();
                                    setShowDateFilter(false);
                                }
                            }}
                        />
                        <Label htmlFor="date-filter">Use date filter</Label>
                    </div>
                </div>

                {showDateFilter && (
                    <div className='flex gap-4'>
                        <FormField
                            control={form.control}
                            name="laterThan"
                            render={({ field }) => (
                                <FormItem
                                    className='flex flex-col gap-1'
                                >
                                    <FormLabel>Later than</FormLabel>
                                    <FormControl>
                                        <FormDatepicker
                                            field={{
                                                ...field,
                                                onChange: (value) => {
                                                    field.onChange(value);
                                                    submitBtnRef.current?.click();
                                                }
                                            }}
                                            maxDate={new Date()}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='flex items-end pb-3'>
                            <Minus className='size-5' />
                        </div>

                        <FormField
                            control={form.control}
                            name="earlierThan"
                            render={({ field }) => (
                                <FormItem
                                    className='flex flex-col gap-1'
                                >
                                    <FormLabel>Earlier than</FormLabel>
                                    <FormControl>
                                        <FormDatepicker
                                            field={{
                                                ...field,
                                                onChange: (value) => {
                                                    field.onChange(value);
                                                    submitBtnRef.current?.click();
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                <Button
                    ref={submitBtnRef}
                    type='submit'
                    className='hidden'
                >
                    Submit
                </Button>
            </form>
        </Form>
    );
};

export default ResponseFilterForm;
