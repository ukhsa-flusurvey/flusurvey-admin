'use client';

import AvatarFromId from '@/components/AvatarFromID';
import { Activity, Calendar, Edit2, FlagTriangleRight, MoreVertical, PencilIcon, Plus, Tag, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import CopyIdToClipboad from './CopyIdToClipboad';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ParticipantState } from '@/utils/server/types/participantState';
import { format } from 'date-fns';
import StatusBadge from './status-badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { participantStudyStatus } from './utils';
import { Spinner } from '@/components/ui/spinner';
import { updateParticipant } from '@/lib/data/participants';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { flagKeySchema, flagValueSchema } from '@/utils/server/types/flagValidation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ParticipantDetailsProps {
    studyKey: string;
    participant?: ParticipantState;
    onClose: () => void;
    onChange: (participant: ParticipantState) => void;
}

const StatusEditPopover = (props:
    {
        status: string,
        onStatusChange: (status: string) => void
    }) => {
    const [open, setOpen] = useState(false);

    const onStatusChange = (status: string) => {
        props.onStatusChange(status);
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant='ghost'
                    className='size-6 rounded-full'
                >
                    <PencilIcon className='size-3' />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
                <div className='flex flex-col gap-2'>
                    <Field>
                        <FieldLabel className='flex items-center gap-2'>
                            <span className='text-neutral-400'><FlagTriangleRight className='size-3' /></span>
                            Status
                        </FieldLabel>

                        <FieldContent>
                            <Select value={props.status} onValueChange={(value) => onStatusChange(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select status' />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(participantStudyStatus).map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FieldContent>
                    </Field>
                </div>
            </PopoverContent>
        </Popover>
    )
}

const FlagEditorForm = (props: {
    initialValue?: { key: string; value: string; };
    onSave: (key: string, value: string) => void;
    onCancel: () => void;
    usedKeys: string[];
}) => {
    const isNewFlag = props.initialValue === undefined;

    const schema = React.useMemo(() => {
        return z.object({
            key: flagKeySchema.refine((key) => {
                if (!isNewFlag) return true; // editing: key is read-only and already unique
                return !props.usedKeys.includes(key);
            }, {
                message: 'This key is already in use',
            }),
            value: flagValueSchema,
        });
    }, [isNewFlag, props.usedKeys]);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            key: props.initialValue?.key ?? '',
            value: props.initialValue?.value ?? '',
        },
        mode: 'onChange',
    });

    const onSubmit = (values: z.infer<typeof schema>) => {
        if (values.key === props.initialValue?.key && values.value === props.initialValue?.value) {
            props.onCancel();
            return;
        }
        props.onSave(values.key, values.value);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>

                <FormField
                    control={form.control}
                    name="key"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Key</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    readOnly={props.initialValue !== undefined}
                                    className='font-mono text-xs'
                                />
                            </FormControl>
                            {props.initialValue !== undefined && (
                                <FormDescription>
                                    Key cannot be changed when editing existing flags
                                </FormDescription>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className='font-mono text-xs'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='flex justify-end gap-2'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={props.onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        disabled={form.formState.isSubmitting}
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}

const ParticipantFlagSection = (props: {
    participant?: ParticipantState;
    isLoading: boolean;
    onChange: (participant: ParticipantState) => void;
}) => {
    const participant = props.participant;
    const [flagToEdit, setFlagToEdit] = useState<{ key: string, value: string } | undefined>(undefined);
    const [newFlagEditorOpen, setNewFlagEditorOpen] = useState(false);

    if (!participant) return null;

    const flags = participant?.flags ? Object.entries(participant.flags) : [];

    return (
        <div>
            <div className='flex items-center gap-2 justify-between'>
                <h3 className='text-sm font-bold flex items-center gap-2'>
                    <span className='text-muted-foreground'>
                        <Tag className='size-3' />
                    </span>
                    Flags
                </h3>

                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setNewFlagEditorOpen(true)}
                >
                    <Plus className='size-4' />
                </Button>
            </div>

            <div className='rounded-md border border-border overflow-hidden'>
                {flags.length > 0 && <Table className='text-xs'>
                    <TableHeader className='bg-muted'>
                        <TableRow>
                            <TableHead className='h-auto p-2'>KEY</TableHead>
                            <TableHead className='h-auto p-2'>VALUE</TableHead>
                            <TableHead className='h-auto w-16'>
                                <span className='sr-only'>Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {flags.map(([key, value]) => (
                            <TableRow key={key} className='font-mono'>
                                <TableCell className='p-2'>{key}</TableCell>
                                <TableCell className='p-2'>{value}</TableCell>
                                <TableCell className='p-0'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant='ghost' className='w-full h-8'>
                                                <span className='sr-only'>Open menu</span>
                                                <MoreVertical className='h-4 w-4' />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align='end'>
                                            <DropdownMenuItem onClick={() => {
                                                setFlagToEdit({ key: key, value: value });
                                            }}>
                                                <Edit2 className='mr-2 h-4 w-4' />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => {
                                                if (confirm('Are you sure you want to delete this flag?')) {
                                                    const newFlags = { ...participant?.flags };
                                                    delete newFlags[key];
                                                    props.onChange({ ...participant, flags: newFlags });
                                                }
                                            }}>
                                                <Trash2 className='mr-2 h-4 w-4' />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                }

                {flags.length === 0 && <div className='flex items-center justify-center h-16 text-xs text-muted-foreground'>
                    No participant flags
                </div>}
            </div>

            <Dialog
                open={flagToEdit !== undefined}
                onOpenChange={(open) => {
                    if (!open) {
                        setFlagToEdit(undefined);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Edit flag
                        </DialogTitle>
                    </DialogHeader>
                    <FlagEditorForm
                        initialValue={flagToEdit}
                        usedKeys={flags.map(([key,]) => key)}
                        onSave={(key, value) => {
                            props.onChange({ ...participant, flags: { ...participant?.flags, [key]: value } });
                            setFlagToEdit(undefined);
                        }}
                        onCancel={() => {
                            setFlagToEdit(undefined);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog
                open={newFlagEditorOpen}
                onOpenChange={setNewFlagEditorOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Add new flag
                        </DialogTitle>
                    </DialogHeader>
                    <FlagEditorForm
                        usedKeys={flags.map(([key,]) => key)}
                        onSave={(key, value) => {
                            props.onChange({ ...participant, flags: { ...participant?.flags, [key]: value } });
                            setNewFlagEditorOpen(false);
                        }}
                        onCancel={() => {
                            setNewFlagEditorOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

const ParticipantDetails: React.FC<ParticipantDetailsProps> = (props) => {
    const participant = props.participant;
    const lastModified = participant?.modifiedAt ? participant.modifiedAt : participant?.lastSubmissions ? Object.values(participant.lastSubmissions).sort((a, b) => b - a)[0] : undefined;

    const [isLoading, setIsLoading] = useState(false);


    const onUpdateParticipant = async (participant: ParticipantState) => {
        setIsLoading(true);

        try {
            const resp = await updateParticipant(props.studyKey, participant);
            if (resp.error) {
                throw new Error(resp.error);
            }
            if (!resp.participant) {
                throw new Error('No participant returned');
            }
            toast.success('Participant updated');
            props.onChange(resp.participant);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update participant');
        } finally {
            setIsLoading(false);
        }
    }

    const renderParticipantCard = () => {
        if (!participant) return null;

        return (<div className='flex flex-col gap-6'>
            <div className='flex items-start gap-4'>
                <div>
                    <AvatarFromId
                        userId={participant.participantId}
                        pixelSize={5}
                    />
                </div>
                <div className=''>
                    <div className='text-sm mb-1 font-semibold'>
                        Participant ID
                    </div>
                    <p
                        className='flex items-center gap-2'
                    >
                        <span className='font-mono text-xs truncate'>{participant.participantId}</span>
                        <CopyIdToClipboad
                            participantId={participant.participantId}
                        />
                    </p>
                </div>

                <div className='grow'></div>

                {isLoading && (
                    <div>
                        <Spinner className='size-6' />
                    </div>
                )}

            </div>

            <div className='flex gap-8 items-end'>
                <div className=''>
                    <div className='text-sm mb-1 flex items-center gap-2'>
                        <span className='text-neutral-400'><Calendar className='size-3' /></span>
                        Joined
                    </div>
                    <div className='font-mono text-sm font-semibold'>
                        {format(new Date(participant.enteredAt * 1000), 'dd-MMM-yyyy')}
                    </div>
                </div>

                <div className=''>
                    <div className='text-sm text-foreground mb-1 flex items-center gap-2'>
                        <span className='text-neutral-400'><Activity className='size-3' /></span>
                        Last modified
                    </div>
                    <div className='font-mono text-sm font-semibold'>
                        {lastModified ? format(new Date(lastModified * 1000), 'dd-MMM-yyyy') : 'Never'}
                    </div>
                </div>
                <span className='grow'></span>

                <div className='flex items-center gap-1'>
                    <StatusBadge status={participant.studyStatus} />
                    <StatusEditPopover status={participant.studyStatus}
                        onStatusChange={(value) => {
                            const newParticipant = {
                                ...participant,
                                studyStatus: value,
                            }
                            onUpdateParticipant(newParticipant);
                        }}
                    />
                </div>
            </div>
        </div>)
    }

    return (
        <Dialog
            open={props.participant !== undefined}
            onOpenChange={(open) => {
                if (!open) {
                    props.onClose();
                }
            }}
        >
            <DialogContent className='max-w-3xl  max-h-auto overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>
                        Participant details
                    </DialogTitle>
                    <DialogDescription>
                        View and edit state of the selected participant.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    {renderParticipantCard()}
                </div>
                <Separator />

                <ParticipantFlagSection
                    participant={participant}
                    isLoading={isLoading}
                    onChange={(participant) => {
                        onUpdateParticipant(participant);
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}

export default ParticipantDetails;
