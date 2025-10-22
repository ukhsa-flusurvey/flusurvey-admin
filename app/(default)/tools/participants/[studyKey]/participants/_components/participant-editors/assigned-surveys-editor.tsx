import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AssignedSurvey, ParticipantState } from "@/utils/server/types/participantState";
import { addMinutes, format } from "date-fns";
import { ArrowDown, ArrowUp, Edit2, FileStack, MoreVertical, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

const AssignedSurveysEditor = (props: {
    participant?: ParticipantState;
    isLoading: boolean;
    onChange: (participant: ParticipantState) => void;
    surveyKeys: string[];
}) => {
    const participant = props.participant;
    const assigned = participant?.assignedSurveys || [];

    const [editorState, setEditorState] = useState<{ index?: number; value?: AssignedSurvey } | undefined>(undefined);
    const [newEditorOpen, setNewEditorOpen] = useState(false);

    if (!participant) return null;

    const moveItem = (from: number, to: number) => {
        if (to < 0 || to >= assigned.length) return;
        const next = assigned.slice();
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        props.onChange({ ...participant, assignedSurveys: next });
    };

    return <div>
        <div className='flex items-center gap-2 justify-between'>
            <h3 className='text-sm font-bold flex items-center gap-2'>
                <span className='text-muted-foreground'>
                    <FileStack className='size-3' />
                </span>
                Assigned surveys
            </h3>

            <Button
                variant='ghost'
                size='icon'
                onClick={() => setNewEditorOpen(true)}
                disabled={props.isLoading}
            >
                <Plus className='size-4' />
            </Button>
        </div>

        <div className='rounded-md border border-border overflow-hidden'>
            {assigned.length > 0 && <Table className='text-xs'>
                <TableHeader className='bg-muted'>
                    <TableRow>
                        <TableHead className='h-auto p-2'>SURVEY KEY</TableHead>
                        <TableHead className='h-auto p-2'>CATEGORY</TableHead>
                        <TableHead className='h-auto p-2'>FROM</TableHead>
                        <TableHead className='h-auto p-2'>UNTIL</TableHead>
                        <TableHead className='h-auto w-16'>
                            <span className='sr-only'>Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assigned.map((item, index) => (
                        <TableRow key={index} className='font-mono'>
                            <TableCell className='p-2'>{item.surveyKey}</TableCell>
                            <TableCell className='p-2'>{item.category ?? 'normal'}</TableCell>
                            <TableCell className='p-2'>{item.validFrom ? format(new Date(item.validFrom * 1000), 'dd-MMM-yyyy HH:mm') : '—'}</TableCell>
                            <TableCell className='p-2'>{item.validUntil ? format(new Date(item.validUntil * 1000), 'dd-MMM-yyyy HH:mm') : '—'}</TableCell>
                            <TableCell className='p-0'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='ghost' className='w-full h-8' disabled={props.isLoading}>
                                            <span className='sr-only'>Open menu</span>
                                            <MoreVertical className='h-4 w-4' />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                        <DropdownMenuItem onClick={() => {
                                            setEditorState({ index, value: { ...item } });
                                        }}>
                                            <Edit2 className='mr-2 h-4 w-4' />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem disabled={index === 0} onClick={() => moveItem(index, index - 1)}>
                                            <ArrowUp className='mr-2 h-4 w-4' />
                                            Move up
                                        </DropdownMenuItem>
                                        <DropdownMenuItem disabled={index === assigned.length - 1} onClick={() => moveItem(index, index + 1)}>
                                            <ArrowDown className='mr-2 h-4 w-4' />
                                            Move down
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => {
                                            if (confirm('Are you sure you want to delete this assignment?')) {
                                                const next = assigned.filter((_, i) => i !== index);
                                                props.onChange({ ...participant, assignedSurveys: next });
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
            </Table>}

            {assigned.length === 0 && <div className='flex items-center justify-center h-16 text-xs text-muted-foreground'>
                No assigned surveys
            </div>}
        </div>

        <Dialog
            open={editorState !== undefined}
            onOpenChange={(open) => {
                if (!open) { setEditorState(undefined); }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit assignment
                    </DialogTitle>
                </DialogHeader>
                {editorState && (
                    <EditorForm
                        surveyKeys={props.surveyKeys}
                        initial={editorState.value}
                        onSave={(updated) => {
                            const next = assigned.slice();
                            if (editorState.index === undefined) { return; }
                            next[editorState.index] = updated;
                            props.onChange({ ...participant, assignedSurveys: next });
                            setEditorState(undefined);
                        }}
                        onCancel={() => setEditorState(undefined)}
                    />
                )}
            </DialogContent>
        </Dialog>

        <Dialog
            open={newEditorOpen}
            onOpenChange={setNewEditorOpen}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add assignment
                    </DialogTitle>
                </DialogHeader>
                <EditorForm
                    surveyKeys={props.surveyKeys}
                    onSave={(created) => {
                        const next = [...assigned, created];
                        props.onChange({ ...participant, assignedSurveys: next });
                        setNewEditorOpen(false);
                    }}
                    onCancel={() => setNewEditorOpen(false)}
                />
            </DialogContent>
        </Dialog>
    </div>;
}

// Helpers and inline form component
const dateToInputStr = (date: Date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
};

const categories = ["prio", "immediate", "normal", "optional"] as const;
type Category = typeof categories[number];

const EditorForm = (props: {
    surveyKeys: string[];
    initial?: AssignedSurvey;
    onSave: (value: AssignedSurvey) => void;
    onCancel: () => void;
}) => {
    const initial = props.initial;
    const initialFromStr = useMemo(() => {
        if (initial?.validFrom) { return dateToInputStr(new Date(initial.validFrom * 1000)); }
        return dateToInputStr(addMinutes(new Date(), 0));
    }, [initial?.validFrom]);
    const initialUntilStr = useMemo(() => {
        if (initial?.validUntil) { return dateToInputStr(new Date(initial.validUntil * 1000)); }
        return "";
    }, [initial?.validUntil]);

    const [surveyKey, setSurveyKey] = useState<string>(initial?.surveyKey ?? "");
    const [category, setCategory] = useState<Category>((initial?.category as Category) ?? "normal");
    const [fromStr, setFromStr] = useState<string>(initial?.validFrom ? initialFromStr : "");
    const [untilStr, setUntilStr] = useState<string>(initial?.validUntil ? initialUntilStr : "");

    const trimmedSurveyKey = surveyKey.trim();
    const fromMs = fromStr ? new Date(fromStr).getTime() : NaN;
    const untilMs = untilStr ? new Date(untilStr).getTime() : NaN;

    const keyError = trimmedSurveyKey.length === 0 ? 'Survey key is required' : undefined;
    const rangeError = (() => {
        if (!fromStr || !untilStr) { return undefined; }
        if (isNaN(fromMs) || isNaN(untilMs)) { return 'Invalid date/time'; }
        if (fromMs >= untilMs) { return '"From" must be earlier than "Until"'; }
        return undefined;
    })();

    const isValid = !keyError && !rangeError;

    return (
        <div className='space-y-4'>
            <div className='space-y-2'>
                <Label htmlFor='survey-key'>Survey key</Label>
                <Select value={surveyKey} onValueChange={setSurveyKey}>
                    <SelectTrigger id='survey-key'>
                        <SelectValue placeholder='Select survey key' />
                    </SelectTrigger>
                    <SelectContent>
                        {props.surveyKeys.map((key) => (
                            <SelectItem key={key} value={key}>{key}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {keyError && <p className='text-xs text-destructive'>{keyError}</p>}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='category'>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                    <SelectTrigger id='category'>
                        <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <Label htmlFor='valid-from'>From</Label>
                    <Input
                        id='valid-from'
                        type='datetime-local'
                        value={fromStr}
                        onChange={(e) => setFromStr(e.target.value)}
                    />
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='valid-until'>Until</Label>
                    <Input
                        id='valid-until'
                        type='datetime-local'
                        value={untilStr}
                        onChange={(e) => setUntilStr(e.target.value)}
                    />
                </div>
            </div>
            {rangeError && <p className='text-xs text-destructive'>{rangeError}</p>}

            <div className='flex items-center justify-end gap-2'>
                <Button variant='outline' onClick={props.onCancel}>Cancel</Button>
                <Button
                    onClick={() => {
                        if (!isValid) { return; }
                        const result: AssignedSurvey = {
                            surveyKey: trimmedSurveyKey,
                            category: category,
                            validFrom: fromStr ? Math.floor(new Date(fromStr).getTime() / 1000) : undefined,
                            validUntil: untilStr ? Math.floor(new Date(untilStr).getTime() / 1000) : undefined,
                        };
                        props.onSave(result);
                    }}
                    disabled={!isValid}
                >
                    Save
                </Button>
            </div>
        </div>
    );
};

export default AssignedSurveysEditor;
