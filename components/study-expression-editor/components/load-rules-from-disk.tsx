import Filepicker from '@/components/inputs/Filepicker';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import { useStudyExpressionEditor } from '../study-expression-editor-context';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';

import { toast } from 'sonner';
import { ExpArg, Expression } from '@/components/expression-editor/utils';

type SelectedFileInfo = 'invalid' | 'rules' | 'actions';

const isStudyRuleContent = (rules: Expression[]) => {
    if (rules.at(0)?.name !== 'IFTHEN') {
        return false;
    }
    if ((rules.at(0)?.data?.at(0) as ExpArg)?.exp?.name !== 'checkEventType') {
        return false;
    }
    return true;
}

const LoadRulesFromDisk: React.FC = () => {
    const {
        sessions,
        loadSession,
        deleteSession,
        initNewSession,
        changeView,
    } = useStudyExpressionEditor();
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);
    const [newRulesToLoad, setNewRulesToLoad] = React.useState<Expression[] | undefined>(undefined);
    const [nameFromFilename, setNameFromFilename] = React.useState<string | undefined>(undefined);

    let selectedFileType: SelectedFileInfo | undefined;

    if (!newRulesToLoad) {
        if (errorMsg) {
            selectedFileType = 'invalid'
        } else {
            selectedFileType = undefined;
        }
    } else {
        if (errorMsg) {
            selectedFileType = 'invalid'
        } else {
            if (newRulesToLoad.length > 0) {
                if (isStudyRuleContent(newRulesToLoad)) {
                    selectedFileType = 'rules';
                } else {
                    selectedFileType = 'actions';
                }
            }
        }
    }




    const filePickerHint = (selectedFileInfo?: SelectedFileInfo) => {
        switch (selectedFileInfo) {
            case 'rules':
                return <p className='text-xs text-muted-foreground'>
                    Selected file appears to be a rule file.
                </p>
            case 'actions':
                return <p className='text-xs text-muted-foreground'>
                    Selected file appears to be an action file.
                </p>
            case 'invalid':
                return null;
            default:
                return <p className='text-xs text-muted-foreground'>
                    Select an action or rule JSON file to load.
                </p>;
        }
    }

    return (
        <div className='flex flex-col items-center justify-center p-6 h-full'>
            <div className='w-full max-w-2xl border-border border rounded-lg p-6 space-y-6'>

                <div className='py-3 space-y-4'>
                    <h2 className='text-xl font-bold mb-2'>
                        Load rules from disk
                    </h2>

                    <div className='space-y-2'>
                        <Filepicker
                            id='rules upload'
                            accept={{
                                'application/json': ['.json'],
                            }}
                            onChange={(files) => {
                                setNewRulesToLoad(undefined);
                                setErrorMsg(undefined);

                                if (files.length > 0) {
                                    // read file as a json
                                    const reader = new FileReader();
                                    const filename = files[0].name;
                                    const targetName = filename.split('.').at(0)?.split('_').slice(1).join('_');
                                    setNameFromFilename(targetName);

                                    reader.onload = (e) => {
                                        const text = e.target?.result;
                                        if (typeof text === 'string') {
                                            const data = JSON.parse(text);

                                            if (!Array.isArray(data) ||
                                                data.some(e => !e.name)
                                            ) {
                                                setErrorMsg('The selected file is not a valid rule file.');
                                                toast.error('The selected file is not a valid rule file.');
                                                return;
                                            }

                                            setNewRulesToLoad(data as Expression[]);
                                        } else {
                                            setNewRulesToLoad(undefined);
                                            setErrorMsg('Error reading file');
                                            toast.error('Error reading file');
                                        }

                                    }
                                    reader.readAsText(files[0]);
                                }
                            }}
                        />
                        {filePickerHint(selectedFileType)}
                        {errorMsg && (
                            <p className='text-destructive mt-3'>{errorMsg}</p>
                        )}
                    </div>
                    <Button
                        variant={'default'}
                        disabled={selectedFileType === 'invalid' || selectedFileType === undefined}
                        onClick={() => {
                            if (!newRulesToLoad) {
                                toast.error('No rules to load');
                                return;
                            }


                            initNewSession(
                                newRulesToLoad,
                                selectedFileType === 'rules' ? 'study-rules' : 'action',
                                nameFromFilename
                            )
                            changeView('expression-editor');

                            toast.success('Rules loaded');
                        }}
                    >
                        Load
                    </Button>
                </div>

                {sessions.length > 0 && <div className='space-y-6'>
                    <Separator />
                    <h2 className='text-xl font-bold mb-2'>
                        Open a recent session
                    </h2>
                    <ul className='space-y-2  max-h-64 overflow-y-auto'>
                        {sessions.map((session, index) => (
                            <li key={index}>
                                <ContextMenu>
                                    <ContextMenuTrigger>
                                        <Button
                                            variant={'outline'}
                                            className='w-full h-auto'
                                            onClick={() => {
                                                loadSession(session.id);
                                            }}
                                        >
                                            <div className='flex items-center justify-between w-full'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='font-medium'>
                                                        {session.name ? session.name : '(no name)'}
                                                    </span>
                                                    <span className='text-xs text-muted-foreground text-end'>
                                                        (Edited {new Date(session.lastModified).toLocaleString()})
                                                    </span>
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Badge
                                                        className='text-xs'
                                                        variant={session.mode === 'study-rules' ? 'outline' : 'primaryOutline'}
                                                    >
                                                        {session.mode === 'study-rules' ? 'Study rules' : 'Actions'}
                                                    </Badge>
                                                    <span className='text-muted-foreground'>
                                                        <ChevronRight className='size-4' />
                                                    </span>
                                                </div>
                                            </div>
                                        </Button>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem onClick={() => {
                                            if (!confirm('Are you sure you want to delete this session? All unsaved changes will be lost.')) {
                                                return;
                                            }
                                            deleteSession(session.id);
                                        }}>
                                            Delete
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            </li>
                        ))}
                    </ul>
                </div>}
            </div>
        </div>
    );
};

export default LoadRulesFromDisk;
