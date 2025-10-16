'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pencil, Trash2, Plus, CalendarIcon } from 'lucide-react';
import { StudyVariable, StudyVariableDateConfig, StudyVariableFloatConfig, StudyVariableIntConfig, StudyVariableStringConfig, StudyVariableType } from '@/utils/server/types/study-variables';
import VariableDefEditDialog from '@/app/(default)/tools/study-configurator/[studyKey]/variables/_components/VariableDefEditDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';
import { deleteStudyVariable, updateStudyVariableValue } from '@/lib/data/study-variables-api';
import { useRouter } from 'next/navigation';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';

interface VariableListClientProps {
    studyKey: string;
    variables: Array<StudyVariable>;
}

const StringValuePopover: React.FC<{
    value?: string;
    configs?: StudyVariableStringConfig;
    onSave: (newValue: string) => void;
}> = ({ value, configs, onSave }) => {
    const [open, setOpen] = React.useState(false);
    const [draft, setDraft] = React.useState<string>(value ?? '');

    const validationError = React.useMemo(() => {
        if (!configs) return undefined;
        const length = draft?.length ?? 0;
        if (typeof configs.minLength === 'number' && length < configs.minLength) {
            return `Must be at least ${configs.minLength} characters`;
        }
        if (typeof configs.maxLength === 'number' && length > configs.maxLength) {
            return `Must be at most ${configs.maxLength} characters`;
        }
        if (configs.pattern) {
            try {
                const re = new RegExp(configs.pattern);
                if (!re.test(draft ?? '')) {
                    return 'Does not match required pattern';
                }
            } catch {
                // ignore invalid regex pattern
            }
        }
        return undefined;
    }, [draft, configs]);

    React.useEffect(() => {
        if (open) {
            setDraft(value ?? '');
        }
    }, [open, value]);

    const handleCancel = () => {
        setDraft(value ?? '');
        setOpen(false);
    };

    const handleSave = () => {
        onSave(draft ?? '');
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={'outline'} className='justify-between w-full'>
                    <span className='truncate text-left grow'>{value ?? '—'}</span>
                    <Pencil className='opacity-70' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80' align='start'>
                <div className='flex flex-col gap-3'>
                    <Input
                        type='text'
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        minLength={configs?.minLength}
                        maxLength={configs?.maxLength}
                        pattern={configs?.pattern}
                        aria-invalid={Boolean(validationError) || undefined}
                    />
                    {validationError && (
                        <span className='text-xs text-destructive'>{validationError}</span>
                    )}
                    <div className='flex justify-end gap-2'>
                        <Button variant={'ghost'} onClick={handleCancel}>Cancel</Button>
                        <Button onClick={handleSave} disabled={Boolean(validationError)}>Save</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

const NumberValuePopover: React.FC<{
    value?: number;
    configs?: StudyVariableIntConfig | StudyVariableFloatConfig;
    integer?: boolean;
    onSave: (newValue: number) => void;
}> = ({ value, configs, integer, onSave }) => {
    const [open, setOpen] = React.useState(false);
    const [draft, setDraft] = React.useState<string>(
        typeof value === 'number' && !Number.isNaN(value) ? String(value) : ''
    );

    const parsed = React.useMemo(() => {
        if (draft === '') return undefined;
        const n = Number(draft);
        if (Number.isNaN(n)) return NaN;
        return integer ? Math.round(n) : n;
    }, [draft, integer]);

    const validationError = React.useMemo(() => {
        if (draft === '') return undefined; // allow empty while editing
        if (parsed === undefined || Number.isNaN(parsed)) return 'Enter a valid number';
        if (typeof configs?.min === 'number' && parsed < configs.min) {
            return `Must be ≥ ${configs.min}`;
        }
        if (typeof configs?.max === 'number' && parsed > configs.max) {
            return `Must be ≤ ${configs.max}`;
        }
        return undefined;
    }, [parsed, draft, configs]);

    React.useEffect(() => {
        if (open) {
            setDraft(typeof value === 'number' && !Number.isNaN(value) ? String(value) : '');
        }
    }, [open, value]);

    const handleCancel = () => {
        setDraft(typeof value === 'number' && !Number.isNaN(value) ? String(value) : '');
        setOpen(false);
    };

    const handleSave = () => {
        if (parsed === undefined || Number.isNaN(parsed)) return;
        onSave(parsed);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={'outline'} className='justify-between w-full'>
                    <span className='truncate text-left grow'>{
                        typeof value === 'number' && !Number.isNaN(value) ? String(value) : '—'
                    }</span>
                    <Pencil className='opacity-70' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80' align='start'>
                <div className='flex flex-col gap-3'>
                    <Input
                        type='number'
                        inputMode='decimal'
                        step={integer ? 1 : 'any'}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        min={configs?.min}
                        max={configs?.max}
                        aria-invalid={Boolean(validationError) || undefined}
                    />
                    {validationError && (
                        <span className='text-xs text-destructive'>{validationError}</span>
                    )}
                    <div className='flex justify-between text-xs text-muted-foreground'>
                        {(configs?.min !== undefined || configs?.max !== undefined) && (
                            <span>
                                {configs?.min !== undefined ? `Min: ${configs.min}` : ''}
                                {configs?.min !== undefined && configs?.max !== undefined ? ' · ' : ''}
                                {configs?.max !== undefined ? `Max: ${configs.max}` : ''}
                            </span>
                        )}
                    </div>
                    <div className='flex justify-end gap-2'>
                        <Button variant={'ghost'} onClick={handleCancel}>Cancel</Button>
                        <Button onClick={handleSave} disabled={draft === '' || Boolean(validationError)}>Save</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

const VariableListClient: React.FC<VariableListClientProps> = (props) => {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [editingKey, setEditingKey] = React.useState<string | undefined>(undefined);

    const onEdit = (key: string) => {
        setEditingKey(key);
        setDialogOpen(true);
    };

    const onDelete = (key: string) => {
        startTransition(async () => {
            if (!confirm('Delete this variable? This cannot be undone.')) {
                return;
            }
            try {
                const resp = await deleteStudyVariable(props.studyKey, key);
                if (resp?.error) {
                    toast.error('Failed to delete variable', { description: resp.error });
                    return;
                }
                toast.success('Variable deleted');
                router.refresh();
            } catch (e: unknown) {
                toast.error('Failed to delete variable', { description: (e as Error).message });
            }
        });
    };

    const usedKeys = React.useMemo(() => props.variables.map(v => v.key), [props.variables]);

    const onValueChange = (key: string, type: StudyVariableType, value: string | number | boolean | Date) => {
        startTransition(async () => {
            const resp = await updateStudyVariableValue(props.studyKey, key, type, value);
            if (resp.error) {
                toast.error('Failed to update variable value', { description: resp.error });
                return;
            }
            toast.success('Variable value updated');
        });
    };

    const renderVariable = (v: StudyVariable) => {

        const uiType = v.uiType || 'text';
        const type = v.type;
        let controller: React.ReactNode = null;
        switch (type) {
            case StudyVariableType.STRING:
                if (uiType === 'select') {
                    const selectConfig = v.configs as StudyVariableStringConfig;
                    controller = <Select value={v.value as string} onValueChange={(newValue) => onValueChange(v.key, type, newValue)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a value" />
                        </SelectTrigger>
                        <SelectContent>
                            {selectConfig.possibleValues?.map((v) => (
                                <SelectItem key={v} value={v}>{v}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>;
                } else {
                    controller = (
                        <StringValuePopover
                            value={v.value as string | undefined}
                            configs={v.configs as StudyVariableStringConfig | undefined}
                            onSave={(newValue) => onValueChange(v.key, type, newValue)}
                        />
                    );
                }

                break;
            case StudyVariableType.INTEGER:
                controller = (
                    <NumberValuePopover
                        value={v.value as number | undefined}
                        configs={v.configs as StudyVariableIntConfig | undefined}
                        integer
                        onSave={(newValue) => onValueChange(v.key, type, newValue)}
                    />
                );
                break;
            case StudyVariableType.FLOAT:
                controller = (
                    <NumberValuePopover
                        value={v.value as number | undefined}
                        configs={v.configs as StudyVariableFloatConfig | undefined}
                        onSave={(newValue) => onValueChange(v.key, type, newValue)}
                    />
                );
                break;
            case StudyVariableType.BOOLEAN:
                controller = (
                    <div className='flex items-center gap-2'>
                        <Switch
                            checked={v.value as boolean | undefined}
                            onCheckedChange={(newValue) => onValueChange(v.key, type, newValue)}
                        />
                        <span className='text-xs uppercase font-mono text-muted-foreground'>
                            {v.value as boolean | undefined ? 'True' : 'False'}
                        </span>
                    </div>
                );
                break;
            case StudyVariableType.DATE:
                const dateConfig = v.configs as StudyVariableDateConfig | undefined;
                const minDate = dateConfig?.min;
                const maxDate = dateConfig?.max;
                controller = (
                    <Popover>
                        <PopoverTrigger asChild>

                            <Button
                                variant={"outline"}
                                className={cn(
                                    "min-w-[200px] w-full pl-3 text-left font-normal",
                                    !v.value && "text-muted-foreground"
                                )}
                            >
                                {v.value ? (
                                    format(v.value as Date, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                            </Button>

                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                id={v.key}
                                mode="single"
                                selected={v.value as Date | undefined}
                                onSelect={(date) => {
                                    if (date) {
                                        onValueChange(v.key, type, date);
                                    }
                                }}
                                disabled={(date) => {
                                    if (minDate && date < minDate) {
                                        return true;
                                    }
                                    if (maxDate && date > maxDate) {
                                        return true;
                                    }
                                    return false;
                                }}
                                initialFocus
                                fromDate={minDate}
                                toDate={maxDate}
                            />
                        </PopoverContent>
                    </Popover>

                );
                break;
        }

        return (
            <Field
                key={v.key}
                className='border border-border rounded-md bg-white shadow-sm drop-shadow-sm'
            >
                <div className='flex items-start justify-between gap-2 p-3'>
                    <div className='space-y-2 grow'>
                        <FieldLabel className='flex gap-2'>
                            <Badge className='font-mono text-xs' variant={'secondary'}>{v.key}</Badge>
                            {v.label && <span>{v.label}</span>}
                        </FieldLabel>

                        {controller}

                        <FieldDescription className='text-xs'>
                            {v.description}
                        </FieldDescription>
                    </div>

                    <div className='-mt-2 -me-2'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={'ghost'} size={'icon'}>
                                    <MoreVertical className='size-5' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <BarLoader loading={isPending} color='#155e75' width={'100%'} />
                                <DropdownMenuItem onClick={() => onEdit(v.key)}>
                                    <Pencil className='size-4 me-2 opacity-70' />
                                    Edit configs
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='text-red-600' onClick={() => onDelete(v.key)}>
                                    <Trash2 className='size-4 me-2 opacity-70' />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </Field>
        )
    }

    return (
        <FieldGroup className='flex flex-col gap-4'>

            {props.variables.length > 0 && (
                <div className='space-y-2'>
                    {props.variables
                        .slice()
                        .sort((a, b) => (b.uiPriority ?? -Infinity) - (a.uiPriority ?? -Infinity))
                        .map(renderVariable)}
                </div>
            )}

            <div className='flex justify-center'>
                <VariableDefEditDialog
                    studyKey={props.studyKey}
                    usedKeys={usedKeys}
                    trigger={<Button variant={'outline'}><Plus className='size-4 me-2' />Create variable</Button>}
                />
            </div>

            <VariableDefEditDialog
                studyKey={props.studyKey}
                usedKeys={usedKeys}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                variableKeyToEdit={editingKey}
            />

        </FieldGroup>
    );
}

export default VariableListClient;


