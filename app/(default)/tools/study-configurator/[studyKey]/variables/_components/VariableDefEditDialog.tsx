"use client"

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { StudyVariable, StudyVariableType, CreateStudyVariablePayload, UpdateStudyVariableConfigsPayload, StudyVariableStringConfig, StudyVariableFloatConfig, StudyVariableIntConfig, StudyVariableDateConfig } from '@/utils/server/types/study-variables';
import { toast } from 'sonner';
import { createStudyVariable, getStudyVariable, updateStudyVariableConfigs } from '@/lib/data/study-variables-api';
import { useRouter } from 'next/navigation';
import FormDatepicker from '@/components/FormDatepicker';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';

type VariableUIType = 'input' | 'select';

// Config schemas used inside the form under `configs`
// Use passthrough to avoid dropping unknown keys when union matching selects a different branch
const stringSchema = z.object({
    minLength: z.preprocess(v => (v === '' || v == null ? undefined : Number(v)), z.number().int().min(0).optional()),
    maxLength: z.preprocess(v => (v === '' || v == null ? undefined : Number(v)), z.number().int().min(0).optional()),
    pattern: z.string().optional(),
    // UI helper for string/select
    possibleValuesText: z.string().optional(),
}).passthrough();

const numberSchema = z.object({
    min: z.number().optional(),
    max: z.number().optional(),
}).passthrough();

const dateSchema = z.object({
    min: z.date().optional(),
    max: z.date().optional(),
}).passthrough();

const baseSchema = z.object({
    label: z.string().optional(),
    description: z.string().optional(),
    key: z.string().min(1, 'Key is required'),
    type: z.nativeEnum(StudyVariableType, { required_error: 'Type is required' }),
    uiPriority: z.preprocess(v => (v === '' || v == null ? undefined : Number(v)), z.number().int().optional()),
    uiType: z.custom<VariableUIType>().optional(),
});

const formSchema = baseSchema.and(z.object({
    // Configs are nested and depend on `type`. Prefer number/date branches before string to reduce accidental matches.
    configs: z.union([numberSchema, dateSchema, stringSchema]).optional(),
}));

const toValidDateOrUndefined = (input: unknown): Date | undefined => {
    if (!input) return undefined;
    if (input instanceof Date) return isNaN(input.getTime()) ? undefined : input;
    if (typeof input === 'string' || typeof input === 'number') {
        const parsed = new Date(input);
        return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return undefined;
};


export interface VariableDefEditDialogProps {
    studyKey: string;
    usedKeys: string[];
    trigger?: React.ReactNode;
    variableKeyToEdit?: string; // when provided, dialog loads and edits definition
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const VariableDefEditDialog: React.FC<VariableDefEditDialogProps> = (props) => {
    const router = useRouter();
    const [open, setOpen] = React.useState<boolean>(false);
    const controlled = typeof props.open === 'boolean';
    const isOpen = controlled ? !!props.open : open;

    const [step, setStep] = React.useState<number>(0); // 0: key+type, 1: type-specific
    const [loading, setLoading] = React.useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            key: '',
            type: undefined as unknown as StudyVariableType,
            uiType: undefined,
            uiPriority: undefined,
            label: '',
            description: '',
            configs: {},
        },
        mode: 'onChange',
    });

    const currentType = form.watch('type');
    const currentKey = form.watch('key');
    const uiType = form.watch('uiType') as VariableUIType | undefined;

    const handleOpenChange = (nextOpen: boolean) => {
        if (controlled) {
            props.onOpenChange?.(nextOpen);
        } else {
            setOpen(nextOpen);
        }
        if (!nextOpen) {
            setStep(0);
            form.reset();
        }
    };

    // Load variable for editing
    React.useEffect(() => {
        if (!isOpen) return;
        if (!props.variableKeyToEdit) return;
        setLoading(true);
        (async () => {
            const resp = await getStudyVariable(props.studyKey, props.variableKeyToEdit!);
            setLoading(false);
            if (resp.error || !resp.variable) {
                toast.error('Failed to load variable', { description: resp.error });
                return;
            }
            const v = resp.variable as StudyVariable;
            const defaults: Partial<z.infer<typeof formSchema>> = {
                key: v.key,
                type: v.type,
                uiType: (v.uiType as VariableUIType | undefined) || undefined,
                uiPriority: v.uiPriority,
                label: v.label || '',
                description: v.description || '',
                configs: {},
            };
            if (v.type === StudyVariableType.STRING) {
                const c = v.configs as StudyVariableStringConfig | undefined;
                defaults.configs = {
                    minLength: c?.minLength,
                    maxLength: c?.maxLength,
                    pattern: c?.pattern,
                    possibleValuesText: (c?.possibleValues || []).join('\n'),
                } as z.infer<typeof stringSchema>;
            }
            if (v.type === StudyVariableType.INTEGER || v.type === StudyVariableType.FLOAT) {
                const c = v.configs as StudyVariableIntConfig | StudyVariableFloatConfig | undefined;
                defaults.configs = {
                    min: c?.min,
                    max: c?.max,
                } as z.infer<typeof numberSchema>;
            }
            if (v.type === StudyVariableType.DATE) {
                const c = v.configs as StudyVariableDateConfig | undefined;
                defaults.configs = {
                    min: c?.min ? new Date(c.min) : undefined,
                    max: c?.max ? new Date(c.max) : undefined,
                } as z.infer<typeof dateSchema>;
            }
            form.reset(defaults);
            setStep(1);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, props.variableKeyToEdit]);

    const usedKeySet = React.useMemo(() => new Set(props.usedKeys || []), [props.usedKeys]);
    const keyInUse = React.useMemo(() => usedKeySet.has(currentKey || ''), [usedKeySet, currentKey]);
    const isEditing = !!props.variableKeyToEdit;
    const canProceedToNext = React.useMemo(() => {
        if (!currentKey || !currentType) return false;
        if (!isEditing && keyInUse) return false;
        return true;
    }, [currentKey, currentType, keyInUse, isEditing]);

    const onSubmit = form.handleSubmit(async (values) => {
        const type = values.type;

        let payload: CreateStudyVariablePayload | UpdateStudyVariableConfigsPayload;
        if (type === StudyVariableType.STRING) {
            const cfg = (values.configs || {}) as z.infer<typeof stringSchema>;
            const configs: StudyVariableStringConfig = {
                minLength: cfg.minLength as number | undefined,
                maxLength: cfg.maxLength as number | undefined,
                pattern: cfg.pattern || undefined,
                possibleValues: (values.uiType === 'select'
                    ? ((cfg.possibleValuesText as string | undefined)?.split(/\r?\n/).map(v => v.trim()).filter(Boolean) || [])
                    : undefined),
            };
            payload = {
                type,
                uiType: values.uiType as string | undefined,
                uiPriority: (typeof values.uiPriority === 'number' ? values.uiPriority : undefined),
                label: values.label || undefined,
                description: values.description || undefined,
                configs,
            };
        } else if (type === StudyVariableType.INTEGER || type === StudyVariableType.FLOAT) {
            const cfg = (values.configs || {}) as z.infer<typeof numberSchema>;
            const configs: StudyVariableIntConfig | StudyVariableFloatConfig = {
                min: cfg.min as number | undefined,
                max: cfg.max as number | undefined,
            };
            payload = {
                type,
                uiType: values.uiType as string | undefined,
                uiPriority: (typeof values.uiPriority === 'number' ? values.uiPriority : undefined),
                label: values.label || undefined,
                description: values.description || undefined,
                configs,
            };
        } else if (type === StudyVariableType.DATE) {
            const cfg = (values.configs || {}) as z.infer<typeof dateSchema>;
            const configs: StudyVariableDateConfig = {
                min: cfg.min,
                max: cfg.max,
            };
            payload = {
                type,
                uiType: values.uiType as string | undefined,
                uiPriority: (typeof values.uiPriority === 'number' ? values.uiPriority : undefined),
                label: values.label || undefined,
                description: values.description || undefined,
                configs,
            };
        } else if (type === StudyVariableType.BOOLEAN) {
            payload = {
                type,
                uiType: values.uiType as string | undefined,
                uiPriority: (typeof values.uiPriority === 'number' ? values.uiPriority : undefined),
                label: values.label || undefined,
                description: values.description || undefined,
            };
        } else {
            payload = {
                type,
                uiType: values.uiType as string | undefined,
                uiPriority: (typeof values.uiPriority === 'number' ? values.uiPriority : undefined),
                label: values.label || undefined,
                description: values.description || undefined,
            };
        }

        try {
            setLoading(true);
            if (isEditing) {
                const res = await updateStudyVariableConfigs(props.studyKey, props.variableKeyToEdit!, payload as UpdateStudyVariableConfigsPayload);
                if (res?.error) throw new Error(res.error);
                toast.success('Variable updated');
            } else {
                const res = await createStudyVariable(props.studyKey, { key: values.key, ...(payload as UpdateStudyVariableConfigsPayload) });
                if (res?.error) throw new Error(res.error);
                toast.success('Variable created');
            }
            router.refresh();
            handleOpenChange(false);
        } catch (e: unknown) {
            toast.error('Failed to save variable', { description: (e as Error).message });
        } finally {
            setLoading(false);
        }
    });

    // no-op helpers removed; using single textarea for possible values

    const renderStep0 = () => (
        <div className='space-y-4'>
            <FormField
                control={form.control}
                name="key"
                key="key"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Key
                            <span className='text-xs text-neutral-500 ml-1'>
                                (must be unique in the study)
                            </span>
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="unique_key" disabled={isEditing} {...field} />
                        </FormControl>
                        {(!isEditing && keyInUse) && (
                            <FormMessage className='text-xs'>Key already in use</FormMessage>
                        )}
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                key="type"
                name="type"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                            value={field.value as unknown as string}
                            onValueChange={(v) => field.onChange(v as StudyVariableType)}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value={StudyVariableType.STRING}>string</SelectItem>
                                <SelectItem value={StudyVariableType.INTEGER}>int</SelectItem>
                                <SelectItem value={StudyVariableType.FLOAT}>float</SelectItem>
                                <SelectItem value={StudyVariableType.BOOLEAN}>boolean</SelectItem>
                                <SelectItem value={StudyVariableType.DATE}>date</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription>{"Choose the variable's data type"}</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="uiPriority"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>UI priority</FormLabel>
                        <FormControl>
                            <Input
                                type='number'
                                placeholder='e.g., 100 (higher shows first)'
                                value={typeof field.value === 'number' ? field.value : ''}
                                onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                            />
                        </FormControl>
                        <FormDescription>Higher values appear earlier in lists.</FormDescription>
                    </FormItem>
                )}
            />
        </div>
    );

    const commonStep1 = () => {
        return (
            <>
                <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                        <FormItem className='sm:col-span-2'>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input placeholder='Human-friendly name' {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className='sm:col-span-2'>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder='Optional description to explain the variable' value={field.value || ''} onChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </>
        )
    }


    const renderStep1String = () => {
        return (
            <div className='space-y-4'>
                {commonStep1()}
                <Separator />
                <div>
                    <FormField
                        control={form.control}
                        name="uiType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>UI type</FormLabel>
                                <Select
                                    value={field.value as string | undefined}
                                    onValueChange={(v) => field.onChange(v as VariableUIType)}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select UI type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={'input'}>input</SelectItem>
                                        <SelectItem value={'select'}>select</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>How the value will be edited in UI</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {uiType === 'input' && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <FormField
                            control={form.control}
                            name="configs.minLength"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min length</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder='e.g., 0'
                                            value={typeof field.value === 'number' ? field.value : ''}
                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="configs.maxLength"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max length</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            placeholder='e.g., 120'
                                            value={typeof field.value === 'number' ? field.value : ''}
                                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="configs.pattern"
                            render={({ field }) => (
                                <FormItem className='sm:col-span-2'>
                                    <FormLabel>Pattern (regex)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='text'
                                            placeholder='^.+$'
                                            value={(field.value as string | undefined) ?? ''}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                {uiType === 'select' && (
                    <div>
                        <FormField
                            control={form.control}
                            name="configs.possibleValuesText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Possible values</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={'Enter one value per line'}
                                            value={(field.value as string | undefined) ?? ''}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormDescription>Each line will be a selectable option.</FormDescription>
                                </FormItem>
                            )}
                        />
                    </div>
                )}

            </div>
        )
    };


    const renderStep1Integer = () => {
        return (
            <div className='grid grid-cols-1 gap-4'>
                {commonStep1()}

                <FormField
                    control={form.control}
                    name="configs.min"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Min</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    placeholder='e.g., 0'
                                    defaultValue={typeof field.value === 'number' ? field.value : ''}
                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="configs.max"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    placeholder='e.g., 100'
                                    defaultValue={typeof field.value === 'number' ? field.value : ''}
                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        )
    }

    const renderStep1Float = () => {
        return (
            <div className='grid grid-cols-1 gap-4'>
                {commonStep1()}
                <FormField
                    control={form.control}
                    name="configs.min"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Min</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    placeholder='e.g., 0'
                                    defaultValue={typeof field.value === 'number' ? field.value : ''}
                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="configs.max"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    placeholder='e.g., 100'
                                    defaultValue={typeof field.value === 'number' ? field.value : ''}
                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        )
    }

    const renderStep1Boolean = () => {
        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {commonStep1()}
            </div>
        )
    }



    const renderStep1Date = () => {
        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {commonStep1()}
                <FormField
                    control={form.control}
                    name="configs.min"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Min date</FormLabel>
                            <FormDatepicker field={{
                                name: field.name,
                                value: toValidDateOrUndefined(field.value),
                                onChange: field.onChange,
                            }} />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="configs.max"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Max date</FormLabel>
                            <FormDatepicker field={{
                                name: field.name,
                                value: toValidDateOrUndefined(field.value),
                                onChange: field.onChange,
                            }}
                            />
                        </FormItem>
                    )}
                />
            </div>
        )
    }


    const renderStep1 = () => {
        switch (currentType) {
            case StudyVariableType.STRING:
                return renderStep1String();
            case StudyVariableType.INTEGER:
                return renderStep1Integer();
            case StudyVariableType.FLOAT:
                return renderStep1Float();
            case StudyVariableType.DATE:
                return renderStep1Date();
            case StudyVariableType.BOOLEAN:
                return renderStep1Boolean();
            default:
                return <p className='text-sm py-8 text-center uppercase text-muted-foreground'>
                    {`${currentType} has no config`}
                </p>
        }
    }


    const title = isEditing ? 'Edit variable' : 'Create variable';
    const description = isEditing ? 'Update variable definition' : 'Define a new variable';

    const renderBody = () => {
        if (loading) {
            return (
                <div className='flex justify-center items-center gap-2 py-8'>
                    <Spinner className='size-4' />
                    <span>Loading latest config...</span>

                </div>
            );
        }
        if (step === 0) {
            return renderStep0();
        }
        return renderStep1();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {props.trigger && (
                <DialogTrigger asChild>
                    <div>{props.trigger}</div>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={onSubmit} className='space-y-6'>
                        {renderBody()}

                        <DialogFooter>
                            {step === 1 && (
                                <Button type='button' variant={'outline'} onClick={() => setStep(0)} disabled={loading}>Back</Button>
                            )}
                            {step === 0 && (
                                <Button type='button' onClick={() => setStep(1)} disabled={!canProceedToNext || loading}>Next</Button>
                            )}
                            {step === 1 && (
                                <Button type='submit' disabled={loading}>{isEditing ? 'Save' : 'Create'}</Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default VariableDefEditDialog;


