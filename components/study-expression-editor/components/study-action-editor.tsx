import React from 'react';
import SessionNameEditor from './session-name-editor';
import NoContextHint from './no-context-hint';
import { Card } from '@/components/ui/card';
import LoadRulesFromDisk from './study-rule-editor/load-rules-from-disk';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DownloadIcon, MoreVerticalIcon, UploadIcon } from 'lucide-react';
import { useStudyExpressionEditor } from '../study-expression-editor-context';
import ExpEditorWrapper from './study-rule-editor/exp-editor-wrapper';
import { ExpArg } from '@/components/expression-editor/utils';

const StudyActionEditor: React.FC = () => {
    const [openLoadRulesDialog, setOpenLoadRulesDialog] = React.useState(false);
    const {
        currentRules,
        saveRulesToDisk,
        updateCurrentRules,
    } = useStudyExpressionEditor();

    return (
        <div className='p-6 space-y-6 overflow-y-auto'>
            <Card className='p-4 space-y-4'>
                <h3 className='font-bold text-sm'>General</h3>
                <SessionNameEditor />
                <NoContextHint />
            </Card>

            <Card className='p-4 space-y-4'>
                <h3 className='font-bold text-sm flex justify-between gap-4'>
                    <span>
                        Edit action rules
                    </span>


                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={'outline'}
                                size={'sm'}
                            >
                                <span>Options</span>
                                <MoreVerticalIcon className='size-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                                disabled={!currentRules}
                                onClick={saveRulesToDisk}
                            >
                                <DownloadIcon className='mr-2 size-4' />
                                Export action to file
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setOpenLoadRulesDialog(true)}
                            >
                                <UploadIcon className='mr-2 size-4' />
                                Open action from file
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </h3>

                <ExpEditorWrapper
                    label={'Actions'}
                    value={currentRules ?
                        currentRules.map(e => ({ dtype: 'exp', exp: e })) : []}
                    onChange={(newValue) => {
                        updateCurrentRules(newValue.filter(e => e !== undefined).map(d => (d as ExpArg).exp))
                    }}
                    useMergeStateCheckers={false}
                    isListSlot={true}
                />
            </Card>

            <LoadRulesFromDisk
                open={openLoadRulesDialog}
                onClose={() => setOpenLoadRulesDialog(false)}
            />
        </div>
    );
};

export default StudyActionEditor;
