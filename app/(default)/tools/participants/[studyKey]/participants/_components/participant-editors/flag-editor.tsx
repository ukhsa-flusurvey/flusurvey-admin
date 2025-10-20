import { ParticipantState } from "@/utils/server/types/participantState";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, Edit2, Trash2, Tag, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import KeyValueEditorForm from "./key-value-editor-form";


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
                    <KeyValueEditorForm
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
                    <KeyValueEditorForm
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

export default ParticipantFlagSection;
