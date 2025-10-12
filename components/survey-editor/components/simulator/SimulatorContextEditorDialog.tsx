import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SurveyContext as ContextValues } from 'survey-engine/data_types';

import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export const SurveyContextEditorDialog: React.FC<{
    contextValues: ContextValues;
    onContextChange: (context: ContextValues) => void;
    onClose: () => void;
    isOpen: boolean;
}> = (props) => {
    const [keyValuePairs, setKeyValuePairs] = React.useState<[string, string][]>([]);
    const [studyVarRows, setStudyVarRows] = React.useState<{
        key: string;
        type: 'string' | 'int' | 'float' | 'boolean' | 'date';
        value: string | boolean;
    }[]>([]);

    //  Pull keyValuePairs when contextValues change / dialog opens
    useEffect(() => {
        if (props.isOpen) {
            setKeyValuePairs(Object.entries(props.contextValues.participantFlags ?? {}));
            const studyVariables = props.contextValues.studyVariables ?? {};
            type StudyVariable = NonNullable<ContextValues['studyVariables']>[string];
            const keys = Object.keys(studyVariables) as Array<keyof typeof studyVariables>;
            const rows = keys.map((key) => {
                const sv = studyVariables[key] as StudyVariable;
                switch (sv.type) {
                    case 'date': {
                        const val = sv.value instanceof Date ? sv.value : new Date(String(sv.value));
                        const iso = isNaN(val.getTime()) ? '' : val.toISOString().slice(0, 10);
                        return { key: String(key), type: 'date' as const, value: iso };
                    }
                    case 'boolean':
                        return { key: String(key), type: 'boolean' as const, value: sv.value };
                    case 'string':
                    case 'int':
                    case 'float':
                        return { key: String(key), type: sv.type, value: String(sv.value ?? '') };
                }
            });
            setStudyVarRows(rows);
        }

    }, [props.contextValues.participantFlags, props.contextValues.studyVariables, props.isOpen]);


    const errorDuplicate = new Set(keyValuePairs.map(([key]) => key)).size !== keyValuePairs.length;
    const errorEmptyKey = keyValuePairs.some(([key]) => key.length === 0);
    const studyDuplicate = new Set(studyVarRows.map(r => r.key)).size !== studyVarRows.length;
    const studyEmptyKey = studyVarRows.some(r => r.key.length === 0);
    const studyInvalidValue = studyVarRows.some(r => {
        switch (r.type) {
            case 'int':
                return r.value === '' || !/^[-+]?\d+$/.test(String(r.value));
            case 'float':
                return r.value === '' || !/^[-+]?\d*(?:\.\d+)?$/.test(String(r.value));
            case 'date': {
                const s = String(r.value);
                if (s === '' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return true;
                const [y, m, d] = s.split('-').map(Number);
                const dt = new Date(y, (m || 1) - 1, d || 1);
                return !(dt.getFullYear() === y && dt.getMonth() === (m - 1) && dt.getDate() === d);
            }
            default:
                return false;
        }
    });
    const error = errorDuplicate || errorEmptyKey || studyDuplicate || studyEmptyKey || studyInvalidValue;


    return (<Dialog open={props.isOpen} onOpenChange={props.onClose}>
        <DialogContent className='max-w-screen-sm'>
            <DialogHeader>
                <DialogTitle>
                    Survey Context Variables
                </DialogTitle>
            </DialogHeader>

            <div className='space-y-4 w-full overflow-hidden p-1'>
                <div className='my-2 space-y-6'>
                    <div key='isLoggedIn' className='flex items-center gap-2 max-w-full'>
                        <Input
                            className='font-mono text-sm '
                            type='text'
                            contentEditable={false}
                            readOnly={true}
                            value={"isLoggedIn"}
                            disabled={true}
                        />
                        <Select onValueChange={
                            (value) => {
                                props.onContextChange({
                                    ...props.contextValues,
                                    isLoggedIn: value === 'true'
                                });
                            }
                        } value={props.contextValues.isLoggedIn?.toString()}>
                            <SelectTrigger className='font-mono text-sm'>
                                <SelectValue placeholder="Please select something." />
                            </SelectTrigger>
                            <SelectContent className='font-mono text-sm'>
                                <SelectGroup>
                                    <SelectItem value="true">true</SelectItem>
                                    <SelectItem value="false">false</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button
                            className='p-3'
                            variant='outline'
                            disabled={true}
                        >
                            <Trash2 className='size-4' />
                        </Button>
                    </div>


                    <div>
                        <p className='text-xs font-semibold mb-2'>Participant flags</p>

                        {
                            keyValuePairs.map(([key, value], index) => (
                                <div key={"key_" + index} className='flex items-center gap-2 mt-2 max-w-full'>
                                    <Input
                                        className='font-mono text-sm'
                                        type='text'
                                        value={key}
                                        minLength={1}
                                        required
                                        placeholder='Name'
                                        onChange={(e) => {
                                            setKeyValuePairs((prev) => {
                                                const newPairs = [...prev];
                                                newPairs[index][0] = e.target.value;
                                                return newPairs;
                                            });
                                        }}
                                    />
                                    <Input
                                        className='font-mono text-sm'
                                        type='text'
                                        value={String(value)}
                                        placeholder='Value'
                                        onChange={(e) => {
                                            setKeyValuePairs((prev) => {
                                                const newPairs = [...prev];
                                                newPairs[index][1] = e.target.value;
                                                return newPairs;
                                            });
                                        }}
                                    />
                                    <Button
                                        variant='outline'
                                        className='p-3'
                                        onClick={() => {
                                            setKeyValuePairs((prev) => {
                                                prev.splice(index, 1);
                                                return [...prev];
                                            });
                                        }}
                                    >
                                        <Trash2 className='size-4' />
                                    </Button>
                                </div>

                            ))
                        }
                    </div>
                    <div className='flex flex-row justify-center gap-2 max-w-full'>
                        <Button
                            className='p-3'
                            variant='outline'
                            disabled={keyValuePairs.some(([key]) => key.length === 0)}
                            onClick={() => {
                                setKeyValuePairs((prev) => {
                                    prev.push(['', '']);
                                    return [...prev];
                                });
                            }}
                        >
                            <Plus className='size-4' />
                            Add new participant flag
                        </Button>
                    </div>
                </div>

                <Separator />

                <div className=''>
                    <p className='text-xs font-semibold mb-2'>Study variables</p>
                    {
                        studyVarRows.map((row, index) => (
                            <div key={"study_" + index} className='flex items-center gap-2 mt-2 max-w-full'>
                                <Input
                                    className='font-mono text-sm'
                                    type='text'
                                    value={row.key}
                                    minLength={1}
                                    required
                                    placeholder='Name'
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setStudyVarRows(prev => {
                                            const next = [...prev];
                                            next[index] = { ...next[index], key: v };
                                            return next;
                                        });
                                    }}
                                />
                                <Select value={row.type} onValueChange={(v: 'string' | 'int' | 'float' | 'boolean' | 'date') => {
                                    setStudyVarRows(prev => {
                                        const next = [...prev];
                                        let newValue: string | boolean = '';
                                        if (v === 'boolean') newValue = false;
                                        if (v === 'date') newValue = '';
                                        next[index] = { ...next[index], type: v, value: newValue };
                                        return next;
                                    })
                                }}>
                                    <SelectTrigger className='font-mono text-sm min-w-24'>
                                        <SelectValue placeholder='Type' />
                                    </SelectTrigger>
                                    <SelectContent className='font-mono text-sm'>
                                        <SelectGroup>
                                            <SelectItem value='string'>string</SelectItem>
                                            <SelectItem value='int'>int</SelectItem>
                                            <SelectItem value='float'>float</SelectItem>
                                            <SelectItem value='boolean'>boolean</SelectItem>
                                            <SelectItem value='date'>date</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {
                                    row.type === 'boolean' ? (
                                        <div className='px-2'>
                                            <Switch
                                                checked={Boolean(row.value)}
                                                onCheckedChange={(checked) => {
                                                    setStudyVarRows(prev => {
                                                        const next = [...prev];
                                                        next[index] = { ...next[index], value: checked };
                                                        return next;
                                                    })
                                                }}
                                            />
                                        </div>
                                    ) : row.type === 'date' ? (
                                        <Input
                                            className='font-mono text-sm'
                                            type='date'
                                            value={String(row.value)}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                setStudyVarRows(prev => {
                                                    const next = [...prev];
                                                    next[index] = { ...next[index], value: v };
                                                    return next;
                                                })
                                            }}
                                        />
                                    ) : (
                                        <Input
                                            className='font-mono text-sm'
                                            type={row.type === 'string' ? 'text' : 'number'}
                                            step={row.type === 'float' ? 'any' : undefined}
                                            value={String(row.value)}
                                            placeholder='Value'
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                setStudyVarRows(prev => {
                                                    const next = [...prev];
                                                    next[index] = { ...next[index], value: v };
                                                    return next;
                                                })
                                            }}
                                        />
                                    )
                                }
                                <Button
                                    variant='outline'
                                    className='p-3'
                                    onClick={() => {
                                        setStudyVarRows(prev => {
                                            const next = [...prev];
                                            next.splice(index, 1);
                                            return next;
                                        })
                                    }}
                                >
                                    <Trash2 className='size-4' />
                                </Button>
                            </div>
                        ))
                    }
                </div>
                <div className='flex flex-row justify-center gap-2 max-w-full'>
                    <Button
                        className='p-3'
                        variant='outline'
                        disabled={studyVarRows.some(r => r.key.length === 0)}
                        onClick={() => {
                            setStudyVarRows(prev => ([...prev, { key: '', type: 'string', value: '' }]));
                        }}
                    >
                        <Plus className='size-4' />
                        Add new study variable
                    </Button>
                </div>

            </div>
            <DialogFooter>
                <p className='text-sm text-red-700 text-center m-auto '>
                    {(errorDuplicate ? "Participant flag keys must be unique. " : "") + (errorEmptyKey ? "Participant flag keys must not be empty. " : "") + (studyDuplicate ? "Study variable keys must be unique. " : "") + (studyEmptyKey ? "Study variable keys must not be empty. " : "") + (studyInvalidValue ? "Study variable values contain invalid entries. " : "")}
                </p>
                <DialogClose asChild>
                    <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button disabled={error}
                    onClick={() => {
                        const studyVariables = Object.fromEntries(studyVarRows.map(r => {
                            switch (r.type) {
                                case 'boolean':
                                    return [r.key, { type: 'boolean' as const, value: Boolean(r.value) }];
                                case 'int':
                                    return [r.key, { type: 'int' as const, value: Number.parseInt(String(r.value), 10) }];
                                case 'float':
                                    return [r.key, { type: 'float' as const, value: Number.parseFloat(String(r.value)) }];
                                case 'date': {
                                    const s = String(r.value);
                                    const [y, m, d] = s.split('-').map(Number);
                                    const dt = new Date(y, (m || 1) - 1, d || 1);
                                    return [r.key, { type: 'date' as const, value: dt }];
                                }
                                default:
                                    return [r.key, { type: 'string' as const, value: String(r.value) }];
                            }
                        }));
                        const newValues = { ...props.contextValues, participantFlags: Object.fromEntries(keyValuePairs), studyVariables };
                        props.onContextChange(newValues);
                        props.onClose();
                    }}
                >
                    Save
                </Button>
            </DialogFooter>

        </DialogContent>
    </Dialog>)
}
