import { ParticipantState } from "@/utils/server/types/participantState";
import { Link, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import KeyValueEditorForm from "./key-value-editor-form";

const LinkingCodeSection = (props: {
    participant?: ParticipantState;
    isLoading: boolean;
    onChange: (participant: ParticipantState) => void;
}) => {
    const participant = props.participant;
    const [linkingCodeToEdit, setLinkingCodeToEdit] = useState<{ key: string, value: string } | undefined>(undefined);
    const [newLinkingCodeEditorOpen, setNewLinkingCodeEditorOpen] = useState(false);

    if (!participant) return null;

    const linkingCodes = participant?.linkingCodes ? Object.entries(participant.linkingCodes) : [];

    return (
        <div>
            <div className='flex items-center gap-2 justify-between'>
                <h3 className='text-sm font-bold flex items-center gap-2'>
                    <span className='text-muted-foreground'>
                        <Link className='size-3' />
                    </span>
                    Linking codes
                </h3>

                <Button
                    variant='ghost'
                    size='icon'
                    disabled={props.isLoading}
                    onClick={() => setNewLinkingCodeEditorOpen(true)}
                >
                    <Plus className='size-4' />
                </Button>
            </div>

            <div className='rounded-md border border-border overflow-hidden'>
                {linkingCodes.length > 0 && <Table className='text-xs'>
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
                        {linkingCodes.map(([key, value]) => (
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
                                                setLinkingCodeToEdit({ key: key, value: value });
                                            }}>
                                                <Edit2 className='mr-2 h-4 w-4' />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => {
                                                if (confirm('Are you sure you want to delete this linking code?')) {
                                                    const newLinkingCodes = { ...participant?.linkingCodes };
                                                    delete newLinkingCodes[key];
                                                    props.onChange({ ...participant, linkingCodes: newLinkingCodes });
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

                {linkingCodes.length === 0 && <div className='flex items-center justify-center h-16 text-xs text-muted-foreground'>
                    No linking codes
                </div>}
            </div>

            <Dialog
                open={linkingCodeToEdit !== undefined}
                onOpenChange={(open) => {
                    if (!open) {
                        setLinkingCodeToEdit(undefined);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Edit linking code
                        </DialogTitle>
                    </DialogHeader>
                    <KeyValueEditorForm
                        initialValue={linkingCodeToEdit}
                        usedKeys={linkingCodes.map(([key,]) => key)}
                        onSave={(key, value) => {
                            props.onChange({ ...participant, linkingCodes: { ...participant?.linkingCodes, [key]: value } });
                            setLinkingCodeToEdit(undefined);
                        }}
                        onCancel={() => {
                            setLinkingCodeToEdit(undefined);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog
                open={newLinkingCodeEditorOpen}
                onOpenChange={setNewLinkingCodeEditorOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Add new linking code
                        </DialogTitle>
                    </DialogHeader>
                    <KeyValueEditorForm
                        usedKeys={linkingCodes.map(([key,]) => key)}
                        onSave={(key, value) => {
                            props.onChange({ ...participant, linkingCodes: { ...participant?.linkingCodes, [key]: value } });
                            setNewLinkingCodeEditorOpen(false);
                        }}
                        onCancel={() => {
                            setNewLinkingCodeEditorOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default LinkingCodeSection;
