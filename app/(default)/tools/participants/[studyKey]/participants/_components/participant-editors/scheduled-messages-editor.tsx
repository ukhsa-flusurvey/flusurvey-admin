import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ParticipantMessage, ParticipantState } from "@/utils/server/types/participantState";
import { format, addMinutes } from "date-fns";
import { Edit2, Mail, MoreVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";

const ScheduledMessagesEditor = (props: {
    participant?: ParticipantState;
    isLoading: boolean;
    onChange: (participant: ParticipantState) => void;
}) => {
    const participant = props.participant;
    const scheduledMessages = participant?.messages || [];
    const [scheduledMessageToEdit, setScheduledMessageToEdit] = useState<ParticipantMessage | undefined>(undefined);
    const [newScheduledMessageEditorOpen, setNewScheduledMessageEditorOpen] = useState(false);

    if (!participant) return null;


    return <div>
        <div className='flex items-center gap-2 justify-between'>
            <h3 className='text-sm font-bold flex items-center gap-2'>
                <span className='text-muted-foreground'>
                    <Mail className='size-3' />
                </span>
                Scheduled messages
            </h3>

            <Button
                variant='ghost'
                size='icon'
                disabled={props.isLoading}
                onClick={() => setNewScheduledMessageEditorOpen(true)}
            >
                <Plus className='size-4' />
            </Button>
        </div>

        <div className='rounded-md border border-border overflow-hidden'>
            {scheduledMessages.length > 0 && <Table className='text-xs'>
                <TableHeader className='bg-muted'>
                    <TableRow>
                        <TableHead className='h-auto p-2'>MESSAGE TYPE</TableHead>
                        <TableHead className='h-auto p-2'>DUE</TableHead>
                        <TableHead className='h-auto w-16'>
                            <span className='sr-only'>Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {scheduledMessages.map((message) => (
                        <TableRow key={message.id} className='font-mono'>
                            <TableCell className='p-2'>{message.type}</TableCell>
                            <TableCell className='p-2'>{format(new Date(message.scheduledFor * 1000), 'dd-MMM-yyyy HH:mm')}</TableCell>
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
                                            setScheduledMessageToEdit({ ...message });
                                        }}>
                                            <Edit2 className='mr-2 h-4 w-4' />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => {
                                            if (confirm('Are you sure you want to delete this message?')) {
                                                const newMessages = scheduledMessages.filter(m => m.id !== message.id)
                                                props.onChange({ ...participant, messages: newMessages });
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

            {scheduledMessages.length === 0 && <div className='flex items-center justify-center h-16 text-xs text-muted-foreground'>
                No messages scheduled
            </div>}
        </div>

        <Dialog
            open={scheduledMessageToEdit !== undefined}
            onOpenChange={(open) => {
                if (!open) {
                    setScheduledMessageToEdit(undefined);
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit scheduled message
                    </DialogTitle>
                </DialogHeader>
                {scheduledMessageToEdit && (
                    <EditorForm
                        initial={scheduledMessageToEdit}
                        onSave={(updated) => {
                            const newMessages = scheduledMessages.map(m => m.id === updated.id ? updated : m);
                            props.onChange({ ...participant, messages: newMessages });
                            setScheduledMessageToEdit(undefined);
                        }}
                        onCancel={() => setScheduledMessageToEdit(undefined)}
                    />
                )}
            </DialogContent>
        </Dialog>

        <Dialog
            open={newScheduledMessageEditorOpen}
            onOpenChange={setNewScheduledMessageEditorOpen}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add scheduled message
                    </DialogTitle>
                </DialogHeader>
                <EditorForm
                    onSave={(created) => {
                        const newMessages = [...scheduledMessages, created];
                        props.onChange({ ...participant, messages: newMessages });
                        setNewScheduledMessageEditorOpen(false);
                    }}
                    onCancel={() => setNewScheduledMessageEditorOpen(false)}
                />
            </DialogContent>
        </Dialog>
    </div>
}

// Helpers and inline form component
const dateToInputStr = (date: Date) => {
    return format(date, 'yyyy-MM-dd\'T\'HH:mm')
}

const EditorForm = (props: {
    initial?: ParticipantMessage | { type?: string; scheduledFor?: number };
    onSave: (message: ParticipantMessage) => void;
    onCancel: () => void;
}) => {
    const initialType = props.initial?.type ?? '';
    const initialDateStr = (() => {
        if (props.initial?.scheduledFor) {
            return dateToInputStr(new Date(props.initial.scheduledFor * 1000));
        }
        return dateToInputStr(addMinutes(new Date(), 5));
    })();

    const [typeStr, setTypeStr] = useState<string>(initialType);
    const [datetimeStr, setDatetimeStr] = useState<string>(initialDateStr);

    const trimmedType = typeStr.trim();
    const selectedMs = datetimeStr ? new Date(datetimeStr).getTime() : NaN;
    const nowMs = Date.now();

    const typeError = trimmedType.length === 0 ? 'Message type is required' : undefined;
    const dateError = isNaN(selectedMs)
        ? 'Invalid date/time'
        : (selectedMs <= nowMs ? 'Date/time must be in the future' : undefined);
    const isValid = !typeError && !dateError;

    return (
        <div className='space-y-4'>
            <div className='space-y-2'>
                <Label htmlFor='message-type'>Message type</Label>
                <Input
                    id='message-type'
                    value={typeStr}
                    onChange={(e) => setTypeStr(e.target.value)}
                    placeholder='Enter message type...'
                />
                {typeError && <p className='text-xs text-destructive'>{typeError}</p>}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='scheduled-for'>Scheduled for</Label>
                <Input
                    id='scheduled-for'
                    type='datetime-local'
                    value={datetimeStr}
                    min={dateToInputStr(new Date())}
                    onChange={(e) => setDatetimeStr(e.target.value)}
                />
                {dateError && <p className='text-xs text-destructive'>{dateError}</p>}
            </div>

            <div className='flex items-center justify-end gap-2'>
                <Button variant='outline' onClick={props.onCancel}>Cancel</Button>
                <Button
                    onClick={() => {
                        if (!isValid) { return; }
                        const id = (props.initial as ParticipantMessage | undefined)?.id ?? uuidv4();
                        const scheduledFor = Math.floor(selectedMs / 1000);
                        props.onSave({ id, type: trimmedType, scheduledFor });
                    }}
                    disabled={!isValid}
                >
                    Save
                </Button>
            </div>
        </div>
    );
}

export default ScheduledMessagesEditor;
